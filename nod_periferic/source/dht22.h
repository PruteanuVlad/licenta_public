#ifndef DHT22_H
#define DHT22_H

/* Coduri de eroare */
#define DHT22_OK           0
#define DHT22_NOT_IDLE     1
#define DHT22_BAD_TIMING   2
#define DHT22_BAD_CHECKSUM 3
#define DHT22_TIMEOUT      4

/* Constante de timp */
#define DHT22_BIT_PREFIX   50
#define DHT22_BIT_0        26
#define DHT22_BIT_1        70

typedef struct DHT22_Result{
	uint16_t humidity;
	uint16_t temperature;
	uint8_t error_code;
} DHT22_Result;

DHT22_Result dht22_error(uint8_t);
void dht22_pin_isr();
void dht22_delay_us(uint16_t);
uint8_t dht22_check_if_idle();
DHT22_Result dht22_init();
DHT22_Result dht22_response();
DHT22_Result dht22_read_data();
DHT22_Result dht22_checksum(uint8_t *data);


#endif /* DHT22_H */
