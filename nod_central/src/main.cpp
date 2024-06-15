#include "NimBLEDevice.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <stdio.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

#include <TFT_eSPI.h>
#include "xbm.h"
#include <Encoder.h>
TFT_eSPI tft = TFT_eSPI();
Encoder myEnc(D2, D3);
#define CORE_DEBUG_LEVEL 4

bool connecting = false;
bool connected = false;
int new_counter = 0;
struct nod
{
  char adresa[18];
  int id_nod;
  int tip_nod;
  float temperatura;
  float lumina;
  float umiditate;
  float apa;
  float nivel_baterie;
  float usa;
  float limita_inf_temp, limita_sup_temp;
  float limita_inf_lumina, limita_sup_lumina;
  float limita_inf_umiditate, limita_sup_umiditate;
  float limita_inf_apa, limita_sup_apa;
  float limita_inf_bat, limita_sup_bat;
  float target_temp;
  int target_light;
};

struct nod noduri[10] = {
    {"11:22:33:44:55:66", 1, 3, 23.4, 830, 61, 11, 90, 0, 22.5, 26.3, 700, 1100, 30, 70, 30, 99, 20, 90, 22, 1},
    {"00:00:00:00:00:00", 2, 2, 23.0, 733, 62, 70, 83, 1, 22.5, 26.3, 700, 1100, 30, 70, 30, 99, 20, 90, 22, 0},
    {"AA:AA:AA:AA:AA:AA", 3, 1, 23.0, 926, 59, 80, 99, 1, 22.5, 26.3, 700, 1100, 30, 70, 30, 99, 20, 90, 22, 1}};
// struct nod noduri[10];
int nr_noduri = 3;
struct controlRequest
{
  int temp;
  int lumina;
  BLEAddress adresaNod;
  struct controlRequest *next;
};

struct SensorData
{
  float umiditate;
  float temperatura;
  float lumina;
  float apa;
  int baterie;
  uint8_t usa;
  uint32_t node_id;
};
typedef struct QueueNode
{
  SensorData data;
  struct QueueNode *next;
} QueueNode;

QueueNode *queue = NULL;

// Function to add data to the queue
void enqueue(SensorData data)
{
  QueueNode *newNode = (QueueNode *)malloc(sizeof(QueueNode));
  newNode->data = data;
  newNode->next = NULL;

  if (queue == NULL)
  {
    queue = newNode;
  }
  else
  {
    queue->next = newNode;
  }
}
SensorData dequeue()
{
  if (queue == NULL)
  {
    Serial.println("Queue is empty");
    SensorData emptyData = {0};
    return emptyData;
  }
  else
  {
    SensorData data = queue->data;
    queue = queue->next;
    return data;
  }
}
// The remote service we wish to connect to.
static BLEUUID serviceUUID("9274b6e9-a159-45c6-9a59-1fe35ad94dc2");
// The characteristic of the remote service we are interested in.
static BLEUUID char_temp_UUID("f1458cf1-66c5-4491-8f58-820b3ca9c266");
static BLEUUID char_light_UUID("516a8481-4f15-489b-8fc8-03eb5f0459be");

static BLERemoteCharacteristic *pTempCharacteristic;
static BLERemoteCharacteristic *pLightCharacteristic;
static BLEAdvertisedDevice *myDevice;

const char *serverIP = "https://site-licenta-10aff3814de1.herokuapp.com";

const char *ssid = "DIGI-Rhh5";
const char *password = "4D33HDFxHA";

int poz_coloana[7] = {0, 0, 0, 0, 0, 0, 0};
char meniu[6][11] = {"Temp.", "Lumin", "Umiditate", "Ap", "Baterie", "Us"}; // linii meniu
char meniu2[3][12] = {"Lim. inf.", "Lim. sup.", "Control"};                 // coloane meniu
int limite_coloane[3][6] = {                                                // columns limits, mai mic sau egal
    {nr_noduri - 1, 1, 1, 0, 0, 0},
    {nr_noduri - 1, 2, 2, 2, 2, 2},
    {nr_noduri - 1, 3, 3, 2, 2, 2}};
int line_limits[3] = {3, 7, 7};
float multiplicatori[4] = {0.2, 1, 10, 1};
char sufix[6][4] = {"C", "lx", "%", "%", "%", " "};
int row_spacing = 18;
int linie = 0;
int up_prev_state;
int down_prev_state;
int ok_prev_state;
int ok_on = 0;
int color;

int temp;
int Rh;
int pressure;
long oldPosition = 1;
int counter = 0;

BLEScan *pBLEScan;

bool doconnect = false;
int httpResponseCode;

AsyncWebServer server(80);
float temperatura, umiditate, lumina, apa, usa = 0;
int temp_set, light_set = 0;
struct controlRequest *controlRequests = NULL;

BLEClient *pClient = BLEDevice::createClient();
class MyClientCallback : public BLEClientCallbacks
{
  void onConnect(BLEClient *pclient)
  {
  }

  void onDisconnect(BLEClient *pclient)
  {
    Serial.println("onDisconnect");
    connecting = false;
  }

  uint32_t onPassKeyRequest()
  {
    Serial.println("Client PassKeyRequest");
    return 123456;
  }
  bool onConfirmPIN(uint32_t pass_key)
  {
    Serial.print("The passkey YES/NO number: ");
    Serial.println(pass_key);
    return true;
  }

  void onAuthenticationComplete(ble_gap_conn_desc desc)
  {
    Serial.println("Starting BLE work!");
  }
};

bool connectToServer()
{
  connecting = true;
  Serial.print("Forming a connection to ");
  Serial.println(myDevice->getAddress().toString().c_str());

  Serial.println(" - Created client");

  pClient->setClientCallbacks(new MyClientCallback());
  Serial.println(" - Created callback");
  while (!pClient->connect(myDevice, false))
  {
    delay(10);
    new_counter++;
    Serial.println(new_counter);
  }
  Serial.println(" - Connected to server");

  BLERemoteService *pRemoteService = pClient->getService(serviceUUID);

  if (pRemoteService == nullptr)
  {
    Serial.print("Serviciul nu a fost gasit: ");
    Serial.println(serviceUUID.toString().c_str());
    pClient->disconnect();
    return false;
  }
  Serial.println(" - Found our service");

  // Obtain a reference to the characteristic in the service of the remote BLE server.
  pTempCharacteristic = pRemoteService->getCharacteristic(char_temp_UUID);
  if (pTempCharacteristic == nullptr)
  {
    Serial.print("Failed to find pTempCharacteristic UUID: ");
    Serial.println(char_temp_UUID.toString().c_str());
    pClient->disconnect();
    return false;
  }
  Serial.println(" - Found pTempCharacteristic");

  // Obtain a reference to the characteristic in the service of the remote BLE server.
  pLightCharacteristic = pRemoteService->getCharacteristic(char_light_UUID);
  if (pLightCharacteristic == nullptr)
  {
    Serial.print("Failed to find pLightCharacteristic UUID: ");
    Serial.println(char_temp_UUID.toString().c_str());
    pClient->disconnect();
    return false;
  }
  Serial.println(" - Found pLightCharacteristic");
  connected = true;

  String newValueTemp, newValueLight;
  struct controlRequest *temp, *prev;
  temp = controlRequests;
  prev = NULL;
  while (temp != NULL)
  {
    if (temp->adresaNod == myDevice->getAddress())
    {
      newValueTemp = temp->temp == 0 ? "0" : "1";
      newValueLight = temp->lumina == 0 ? "0" : "1";

      Serial.println("Setting pTempCharacteristic characteristic value to \"" + newValueTemp + "\"");
      if (pTempCharacteristic->writeValue(newValueTemp.c_str(), false))
      {
        Serial.println("Write pTempCharacteristic success ");
      }
      else
      {
        Serial.println("Write pTempCharacteristic failed ");
      }

      Serial.println("Setting pLightCharacteristic characteristic value to \"" + newValueLight + "\"");

      if (pLightCharacteristic->writeValue(newValueLight.c_str(), false))
      {
        Serial.println("Write pLightCharacteristic success ");
      }
      else
      {
        Serial.println("Write pLightCharacteristic failed ");
      }
      pClient->disconnect();
      if (prev == NULL)
        controlRequests = NULL;
      else
        prev->next = temp->next;
      free(temp);
      temp = NULL;
      break;
    }
    prev = temp;
    temp = temp->next;
  }

  return true;
}

void post_data(SensorData data)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    // Create JSON document
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["temperature"] = data.temperatura;
    jsonDoc["humidity"] = data.umiditate;
    jsonDoc["water_level"] = data.apa;
    jsonDoc["light"] = data.lumina;
    jsonDoc["node_id"] = data.node_id;
    jsonDoc["battery"] = data.baterie;

    // Serialize JSON to string
    String jsonString;
    serializeJson(jsonDoc, jsonString);
    // Create HTTP client
    HTTPClient http;
    http.begin("https://site-licenta-10aff3814de1.herokuapp.com/add_data");
    http.addHeader("Content-Type", "application/json");
    // Send POST request with JSON data
    httpResponseCode = http.POST(jsonString);

    http.end();
  }
}
class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks
{
  std::string data;
  char buffer[20];
  String newValueTemp, newValueLight;
  struct controlRequest *temp, *prev;

  void onResult(BLEAdvertisedDevice *advertisedDevice)
  {
    if (advertisedDevice->haveServiceUUID() && advertisedDevice->isAdvertisingService(serviceUUID))
    {

      BLEDevice::getScan()->stop();
      SensorData sensorData;
      myDevice = advertisedDevice;

      data = advertisedDevice->getManufacturerData();

      sensorData.umiditate = (uint8_t)data[0] + (uint8_t)data[1] / 100.0;
      sensorData.temperatura = (uint8_t)data[2] + (uint8_t)data[3] / 100.0;
      sensorData.lumina = (uint8_t)data[4] + (uint8_t)data[5] / 100.0;
      sensorData.apa = (uint8_t)data[6] + (uint8_t)data[7] / 100.0;
      sensorData.usa = (uint8_t)data[8];

      sprintf(buffer, "Umiditate: %.2f", umiditate);
      Serial.println(buffer);
      sprintf(buffer, "Temperatura: %.2f", temperatura);
      Serial.println(buffer);
      sprintf(buffer, "Lumina: %.2f", lumina);
      Serial.println(buffer);
      sprintf(buffer, "Apa: %.2f", apa);
      Serial.println(buffer);
      sprintf(buffer, "Usa: %.2f", usa);
      Serial.println(buffer);

      String address = advertisedDevice->getAddress().toString().c_str();
      Serial.println(address);
      for (int i = 0; i < nr_noduri; i++)
      {
        if (address == noduri[i].adresa)
        {
          Serial.println(noduri[i].adresa);
          sensorData.node_id = noduri[i].id_nod;
          break;
        }
      }

      enqueue(sensorData);

      temp = controlRequests;
      prev = NULL;
      while (temp != NULL)
      {
        if (temp->adresaNod == myDevice->getAddress())
        {
          doconnect = true;
          break;
        }
        prev = temp;
        temp = temp->next;
      }
    }
  }
};

void setup(void)
{
  Serial.begin(9600);
  tft.init();
  tft.setRotation(0);
  tft.fillScreen(TFT_BLACK);
  tft.setTextFont(2);
  tft.setTextPadding(0);

  pinMode(D4, INPUT);
  pinMode(D5, INPUT);
  pinMode(D6, INPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.println("IP Address: " + WiFi.localIP().toString());
  // Handle POST requests
  server.on("/post", HTTP_POST, [](AsyncWebServerRequest *request)
            {
    struct controlRequest *controlRequest = (struct controlRequest *)malloc(sizeof(struct controlRequest));

    BLEAddress address;
    for (int i = 0; i < nr_noduri; i++)
    {
      if (request->arg("id_nod").toInt() == noduri[i].id_nod)
      {
        address = BLEAddress(noduri[i].adresa);
        break;
      }
    }

    if(controlRequests == NULL)
      controlRequests = controlRequest;
    else
    {
      struct controlRequest *temp = controlRequests;
      while(temp != NULL){
        if(temp->adresaNod == address)
        {
          temp->temp = request->arg("temp").toInt();
          temp->lumina = request->arg("lumina").toInt();
          break;
        }
        temp = temp->next;
      }
      temp->next = controlRequest;
    }

    controlRequest->temp = request->arg("temp").toInt();
    controlRequest->lumina = request->arg("lumina").toInt();
    controlRequest->adresaNod = address;
    controlRequest->next = NULL;

    Serial.print("Arguments:\n");
    for (int i = 0; i < request->args(); i++) {
      Serial.print("  ");
      Serial.print(request->argName(i));
      Serial.print(": ");
      Serial.println(request->arg(i));
    }

    // Send response
    request->send(200, "text/plain", "POST request received"); });

  server.begin();
  BLEDevice::init("");

  pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setInterval(1349);
  pBLEScan->setWindow(449);
  pBLEScan->setActiveScan(true);
  pBLEScan->start(100, false);
}

int getNodeID(char *address)
{
  for (int i = 0; i < nr_noduri; i++)
  {
    if (strcmp(noduri[i].adresa, address) == 0)
    {
      return (noduri[i].id_nod);
    }
  }
  return -1;
}
void get_noduri(void)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    // Create JSON document
    StaticJsonDocument<300> jsonDoc;

    // Create HTTP client
    HTTPClient http;
    http.begin(String("https://site-licenta-10aff3814de1.herokuapp.com/noduri"));

    httpResponseCode = http.GET();

    DeserializationError error;
    String payload = "{}";
    if (httpResponseCode == 200)
    {
      payload = http.getString();
      Serial.println(payload);
      error = deserializeJson(jsonDoc, payload);

      nr_noduri = jsonDoc["id_nod"].size();
      for (int i = 0; i < nr_noduri; i++)
      {
        int id_nod = jsonDoc["id_nod"][i];
        const char *adresa_ble = jsonDoc["adresa_ble"][i];
        int tip_nod = jsonDoc["tip_nod"][i];
        noduri[i].id_nod = id_nod;
        strcpy(noduri[i].adresa, adresa_ble);
        noduri[i].tip_nod = tip_nod;

        // Create JSON document
        StaticJsonDocument<300> jsonDoc_2;

        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_data?meas=temperatura&time=current&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].temperatura = jsonDoc_2["values"][0];
        }
        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=temp&type=inf&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].limita_inf_temp = jsonDoc_2["value"][0];
        }
        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=temp&type=sup&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].limita_sup_temp = jsonDoc_2["value"][0];
        }

        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_data?meas=umiditate&time=current&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].umiditate = jsonDoc_2["values"][0];
        }
        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=umid&type=inf&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].limita_inf_umiditate = jsonDoc_2["value"][0];
        }
        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=umid&type=sup&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].limita_sup_umiditate = jsonDoc_2["value"][0];
        }

        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_data?meas=nivel_apa&time=current&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].apa = jsonDoc_2["value"][0];
        }
        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=apa&type=inf&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].limita_inf_apa = jsonDoc_2["value"][0];
        }
        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=apa&type=sup&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].limita_sup_apa = jsonDoc_2["values"][0];
        }

        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_data?meas=iluminare&time=current&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].lumina = jsonDoc_2["values"][0];
        }
        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=lumina&type=inf&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].limita_inf_lumina = jsonDoc_2["value"][0];
        }
        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=lumina&type=sup&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].limita_sup_lumina = jsonDoc_2["value"][0];
        }

        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_data?meas=baterie&time=current&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].nivel_baterie = jsonDoc_2["values"][0];
        }
        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=bat&type=inf&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].limita_inf_bat = jsonDoc_2["value"][0];
        }
        payload = "{}";
        http.begin("https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=bat&type=sup&nodeId=" + String(id_nod));
        httpResponseCode = http.GET();
        if (httpResponseCode == 200)
        {
          payload = http.getString();
          error = deserializeJson(jsonDoc_2, payload);
          noduri[i].limita_sup_bat = jsonDoc_2["value"][0];
        }
      }
    }
    else
    {
      Serial.print("HTTP Request failed: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
}

void update_lim_nod()
{
  char *request_addr = "https://site-licenta-10aff3814de1.herokuapp.com/add_limit";
  // Create JSON document
  StaticJsonDocument<200>
      jsonDoc;
  jsonDoc["nodeId"] = noduri[poz_coloana[0]].id_nod;
  switch (linie)
  {
  case 1:
    jsonDoc["prop"] = "temp";
    break;
  case 2:
    jsonDoc["prop"] = "lumina";
    break;
  case 3:
    jsonDoc["prop"] = "umid";
    break;
  case 4:
    jsonDoc["prop"] = "apa";
    break;
  case 5:
    jsonDoc["prop"] = "bat";
    break;
  }
  switch (poz_coloana[linie])
  {
  case 1:
    jsonDoc["type"] = "inf";
    break;
  case 2:
    jsonDoc["type"] = "sup";
    break;
  }
  jsonDoc["val"] = *((float *)(&(noduri[poz_coloana[0]].limita_inf_temp) + (linie - 1) * 2 + poz_coloana[linie] - 1));
  // Serialize JSON to string
  String jsonString;
  serializeJson(jsonDoc, jsonString);
  // Create HTTP client
  HTTPClient http;
  http.begin(String(request_addr));
  http.addHeader("Content-Type", "application/json");
  httpResponseCode = http.POST(jsonString);

  Serial.println(httpResponseCode);

  http.end();
}
int diff;
void loop()
{
  for (int i = 0; i < nr_noduri; i++)
  {
    if (i % 2 == 0)
      color = TFT_RED;
    else
      color = 0x03a0;
    tft.setTextColor(TFT_WHITE);
    if (poz_coloana[0] == i)
    {
      tft.fillRect((128 / (nr_noduri)) * i, 0, (128 / (nr_noduri)), 16, TFT_DARKGREY);
      tft.fillRect((128 / (nr_noduri)) * i + 2, 2, (128 / (nr_noduri)) - 4, 12, color);
    }
    else
    {
      tft.fillRect((128 / (nr_noduri)) * i, 0, (128 / (nr_noduri)), 16, color);
    }
    tft.setCursor(0 + (128 / (nr_noduri)) * i + (128 / (nr_noduri)) / 2, 0);
    tft.print(noduri[i].id_nod);
  }
  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  void *p;
  p = &(noduri[poz_coloana[0]].temperatura);
  for (int i = 0; i < (line_limits[noduri[poz_coloana[0]].tip_nod - 1] - 1); i++)
  {
    tft.setCursor(7, 18 + i * row_spacing);
    if (poz_coloana[i + 1] == 0)
    {
      tft.print(meniu[i]);
      if (i == 1)
        tft.drawXBitmap(40, 21 + i * row_spacing, logo, charWidth, charHeight, TFT_WHITE);
      if (i == 3)
        tft.drawXBitmap(22, 21 + i * row_spacing, logo, charWidth, charHeight, TFT_WHITE);
      if (i == 5)
        tft.drawXBitmap(21, 21 + i * row_spacing, logo, charWidth, charHeight, TFT_WHITE);
      tft.setCursor(72, 18 + i * row_spacing);
      if (i == 5)
      {
        if (*((float *)(p) + i))
          tft.print("inc.");
        else
          tft.print("desc.");
      }
      else
      {
        tft.print(*((float *)(p) + i), 1);
        tft.print(sufix[i]);
      }
    }
    else
    {
      tft.print(meniu2[poz_coloana[i + 1] - 1]);
      tft.setCursor(72, 18 + i * row_spacing);
      if (poz_coloana[i + 1] < 3)
      {
        tft.print(*((float *)(p) + 5 + i * 2 + poz_coloana[i + 1]), 1);
        tft.print(sufix[i]);
      }
      else
      {
        if (linie == 1)
        {
          tft.print(noduri[poz_coloana[0]].target_temp, 1);
          tft.print("C");
        }
        if (linie == 2)
        {
          if (noduri[poz_coloana[0]].target_light)
            tft.print("inc.");
          else
            tft.print("desc.");
        }
      }
    }
  }

  if (digitalRead(D4) == LOW && up_prev_state == HIGH && linie > 0)
  {
    poz_coloana[linie] = 0;
    tft.fillScreen(TFT_BLACK);
    if (ok_on)
    {
      ok_on = 0;
      tft.setCursor(68, -2 + linie * row_spacing);
      tft.print(" ");
      update_lim_nod();
    }
    tft.setCursor(0, -2 + linie * row_spacing);
    tft.print(" ");
    tft.setCursor(120, -2 + linie * row_spacing);
    tft.print(" ");
    linie--;
  }
  if (digitalRead(D5) == LOW && down_prev_state == HIGH && linie < line_limits[noduri[poz_coloana[0]].tip_nod - 1] - 1 - (noduri[poz_coloana[0]].tip_nod != 1))
  {
    if (linie != 0)
      poz_coloana[linie] = 0;
    tft.fillScreen(TFT_BLACK);
    if (ok_on)
    {
      ok_on = 0;
      poz_coloana[linie] = 0;
      tft.setCursor(68, -2 + linie * row_spacing);
      tft.print(" ");
      update_lim_nod();
    }
    tft.setCursor(0, -2 + linie * row_spacing);
    tft.print(" ");
    tft.setCursor(120, -2 + linie * row_spacing);
    tft.print(" ");
    linie++;
  }
  if (digitalRead(D6) == HIGH && ok_prev_state == LOW && linie > 0 && poz_coloana[linie] > 0) // citeste butonul de pe codor rotativ si verifica ca nu e pe linia cu valori, acestea nu pot fi modificate
  {
    tft.setCursor(0, linie * row_spacing);
    tft.print(" ");
    tft.setCursor(65, linie * row_spacing);
    if (ok_on == 0)
    {
      tft.print("<");
    }
    else
    {
      tft.print(" ");
      update_lim_nod();
      tft.setCursor(0, linie * row_spacing);
      tft.print("<");
    }
    ok_on = !ok_on;
  }
  up_prev_state = digitalRead(D4);
  down_prev_state = digitalRead(D5);
  ok_prev_state = digitalRead(D6);
  if (linie != 0)
  {
    tft.setCursor(0, linie * row_spacing);
    if (!ok_on)
      tft.print("<");
    tft.setCursor(120, linie * row_spacing);
    tft.print(">");
  }
  long newPosition = myEnc.read();
  if (newPosition != oldPosition)
  {
    if (newPosition % 2 == 0)
    {
      // tft.fillScreen(TFT_BLACK);
      if (ok_on == 1)
      {
        *((float *)(&(noduri[poz_coloana[0]].limita_inf_temp) + (linie - 1) * 2 + poz_coloana[linie] - 1)) += (newPosition - oldPosition) * multiplicatori[linie - 1];
      }
      else
      {
        if (linie == 0)
        {
          tft.setCursor((128 / (nr_noduri)) * poz_coloana[0] + (128 / (nr_noduri)) / 2, 16);
          tft.print(" ");
        }
        else
        {
          tft.setCursor(7, -2 + linie * row_spacing);
          tft.print("                 ");
        }
        if (linie == 0)
        {
          poz_coloana[1] = 0;
          poz_coloana[2] = 0;
          poz_coloana[3] = 0;
          poz_coloana[4] = 0;
          poz_coloana[5] = 0;
        }
        diff = newPosition - oldPosition;
        tft.fillScreen(TFT_BLACK);
        if (diff > 0)
        {
          if (poz_coloana[linie] < limite_coloane[noduri[poz_coloana[0]].tip_nod - 1][linie])
            poz_coloana[linie] = poz_coloana[linie] + 1;
          else
            poz_coloana[linie] = limite_coloane[noduri[poz_coloana[0]].tip_nod - 1][linie];
        }
        else
        {
          if (poz_coloana[linie] > 0)
            poz_coloana[linie] = poz_coloana[linie] - 1;
          else
            poz_coloana[linie] = 0;
        }
      }
    }
    oldPosition = newPosition;
  }
  if (counter == 0)
  {
    get_noduri();
  }
  if (counter % 5 == 0 && connecting == false)
  {
    pBLEScan->start(10, false);
  }
  if (doconnect == true)
  {
    if (connectToServer())
    {
      Serial.println("We are now connected to the BLE Server.");
    }
    else
    {
      Serial.println("We have failed to connect to the server; there is nothin more we will do.");
    }
    doconnect = false;
  }
  if (queue != NULL)
  {
    SensorData data = dequeue();
    post_data(data);
  }
  counter++;
}