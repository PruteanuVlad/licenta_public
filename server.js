// server/index.js
const audit = require("express-requests-logger");
const express = require("express");
const WebSocket = require('ws');
const mysql = require('mysql');
var cors = require('cors')
const bodyParser = require('body-parser');
const webPush = require('web-push');
const PORT = process.env.PORT || 3001;
const axios = require('axios');
const vapidKeys = {
  publicKey: 'BBdROhb681xQ1osDiyR8vC4Gq_xeDUpr_pWzJyfz2dabLwcrXR-4dD1v0y9vH9PunUhfiiyekom5M6Znw21ATz8',
  privateKey: 'cheieprivata'
};

const db = mysql.createConnection({
  host: 'r6ze0q02l4me77k3.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
  user: 'eeoyrzdi9nqv57go',
  password: 'parola',
  database:'anez63pn0w29oa78'
});

webPush.setVapidDetails(
  'https://master--lighthearted-seahorse-eee8ed.netlify.app/',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let subscriptions = [];


const app = express();
app.use(cors());
app.use(express.json());
app.use(audit());

const wss = new WebSocket.Server({ noServer: true });

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

app.post('/api/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

app.get("/poll_data", (req, res) => {

  if(req.query.time == 'current')
    var sql_query = `SELECT ` + req.query.meas + `, data FROM masuratori WHERE id_nod = ` + req.query.nodeId + ` ORDER BY id_masuratoare DESC LIMIT 1`;
  if(req.query.time == 'day')
    var sql_query = `SELECT ` + req.query.meas + `, data FROM masuratori WHERE data >= NOW() - INTERVAL 1 DAY AND id_nod = ` + req.query.nodeId + `;`;
  if(req.query.time == 'week')
    var sql_query = `SELECT ` + req.query.meas + `, data FROM masuratori WHERE data >= NOW() - INTERVAL 1 WEEK AND id_nod = ` + req.query.nodeId + `;`;
  if(req.query.time == 'month')
    var sql_query = `SELECT ` + req.query.meas + `, data FROM masuratori WHERE data >= NOW() - INTERVAL 1 MONTH AND id_nod = ` + req.query.nodeId + `;`;
  if(req.query.time == 'year')
    var sql_query = `SELECT ` + req.query.meas + `, data FROM masuratori WHERE data >= NOW() - INTERVAL 1 YEAR AND id_nod = ` + req.query.nodeId + `;`;
  db.query(sql_query, function (err, result, fields) {
  if (err) throw err;
  const values = result.map((row) => row[req.query.meas]);
  var datetimes = result.map((row) => row.data.toISOString());

  if(req.query.time == 'day') {
    datetimes = datetimes.map(str => {
      const indexOfT = str.indexOf('T');
      return (indexOfT !== -1 && indexOfT + 1 < str.length) ? str.substr(indexOfT + 1, 5) : '';
    });
  }

  if(req.query.time == 'week') {
    datetimes = datetimes.map(datetimes => {
      const date = new Date(datetimes);
      const dayOfWeek = date.toLocaleDateString('ro-RO', { weekday: 'long' }); // 'long' gives the full day name
      return dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    });
  }


  const jsonData = {
    values: values,
    date: datetimes,
  };
  res.json(jsonData);
  });
});


app.get("/poll_limits", (req, res) => {
  var column_name = req.query.prop + "_lim_" + req.query.type;
  var sql_query = `SELECT ` + column_name + ` FROM limite WHERE id_nod = ` + req.query.nodeId + `;`;
  db.query(sql_query, function (err, result, fields) {
  if (err) throw err;
  const value = result.map((row) => row[column_name]);

  const jsonData = {
    value: value
  };
  res.json(jsonData);
  });
});

app.get("/noduri", (req, res) => {

  var sql_query = `SELECT * FROM noduri;`;
  db.query(sql_query, function (err, result, fields) {
    console.log(result)

    if (err) throw err;


    const id_nod = result.map((row) => row.id_nod);
    const adresa_ble = result.map((row) => row.adresa_ble);
    const tip_nod = result.map((row) => row.tip_nod);

    const jsonData = {
      id_nod: id_nod,
      adresa_ble: adresa_ble,
      tip_nod: tip_nod,
    };
    res.json(jsonData);
  });
});

app.post('/add_data', (req, res) => {
  let notificationPayload = {
    title: 'Alertă!',
    body: '',
  };
  let promises;
  const { temperature, humidity, water_level, light, node_id, battery} = req.body;
  const currentDate = new Date();
  const limitQuery = `
  SELECT 
    temp_lim_inf, temp_lim_sup, 
    umid_lim_inf, umid_lim_sup, 
    lumina_lim_inf, lumina_lim_sup, 
    apa_lim_inf, apa_lim_sup,
    bat_lim_inf, bat_lim_sup
  FROM limite 
  WHERE id_nod = ?
  `;
  var sql = `INSERT INTO masuratori 
              (
                  data, temperatura, umiditate, nivel_apa, iluminare, id_nod, baterie
              )
              VALUES
              (
                  ?, ?, ?, ?, ?, ?, ?
              )`;

  db.query(limitQuery, [node_id], function(err, results) {
    if (err) {
      console.error('Error retrieving limit values:', err);
      res.status(500).json({ success: false, message: 'Error retrieving limit values' });
      return;
    }

    if (results.length === 0) {
      console.error('No limit values found for node_id:', node_id);
      res.status(404).json({ success: false, message: 'No limit values found for node_id' });
      return;
    }

    const limits = results[0];

    if (temperature < limits.temp_lim_inf) {
      notificationPayload.body = `Atenție, temperatura e prea mică!`;
      subscriptions.map(subscription => 
        webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
      );
    }
    if (temperature > limits.temp_lim_sup) {
      notificationPayload.body = `Atenție, temperatura e prea mare!`;
      subscriptions.map(subscription => 
        webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
      );
    }
    if (humidity < limits.umid_lim_inf) {
      notificationPayload.body = `Atenție, umiditatea e prea mică!`;
      subscriptions.map(subscription => 
        webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
      );
    }
    if (humidity > limits.umid_lim_sup) {
      notificationPayload.body = `Atenție, umiditatea e prea mare!`;
      subscriptions.map(subscription => 
        webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
      );
    }
    if (water_level < limits.apa_lim_inf) {
      notificationPayload.body = `Atenție, nivelul apei e prea mic!`;
      subscriptions.map(subscription => 
        webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
      );
    }
    if (water_level > limits.apa_lim_sup) {
      notificationPayload.body = `Atenție, nivelul apei e prea mare!`;
      subscriptions.map(subscription => 
        webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
      );
    }
    if (light < limits.lumina_lim_inf) {
      notificationPayload.body = `Atenție, lumina e prea slabă!`;
      subscriptions.map(subscription => 
        webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
      );
    }
    if (light > limits.lumina_lim_sup) {
      notificationPayload.body = `Atenție, lumina e prea puternică!`;
      subscriptions.map(subscription => 
        webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
      );
    }
    if (battery < limits.bat_lim_inf) {
      notificationPayload.body = `Atenție, nivelul bateriei e prea mic!`;
      subscriptions.map(subscription => 
        webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
      );
    }
    if (battery > limits.bat_lim_sup) {
      notificationPayload.body = `Atenție, nivelul bateriei e prea mare!`;
      subscriptions.map(subscription => 
        webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
      );
    }
  });

  db.query(sql, [currentDate, temperature , humidity, water_level, light, node_id, battery], function (err, data) {
      if (err) {
          // some error occured
      } else {
          // successfully inserted into db
      }
  });
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send("UPDATE");
    }
  });

res.json({ success: true });
});

app.post('/add_node', (req, res) => {
  const { adresa, pin, tip } = req.body;
  console.log(`Received new value: ${adresa}`);
  console.log(`Received new value: ${pin}`);
  console.log(`Received new value: ${tip}`);
  var sql = `INSERT INTO noduri 
              (
                  adresa_ble, pin, tip_nod
              )
              VALUES
              (
                  ?, ?, ?
              )`;
  db.query(sql, [adresa , pin, tip], function (err, data) {
      if (err) {
          // some error occured
      } else {
          // successfully inserted into db
      }
  });
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send("UPDATE");
    }
  });
  res.json({ success: true });
});

app.post('/add_limit', (req, res) => {
  const { nodeId, prop, type, val } = req.body;
  
  column_name=prop+"_lim_"+type;
  console.log(`Received new value: ${column_name}`);
  var sql = `INSERT INTO limite (id_nod, ${column_name})
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE ${column_name} = VALUES(${column_name});`;
  db.query(sql, [nodeId , val], function (err, data) {
      if (err) {
        console.log(`Received new value: ${err}`);
      } else {
          // successfully inserted into db
      }
  });
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send("UPDATE");
    }
  });
  res.json({ success: true });
});


app.post('/control',async  (req, res) => {
  const { nodeId, temp, light } = req.body;
  
  var sql = `UPDATE noduri 
             SET control_lumina = ${light},
             control_temp = ${temp}
             WHERE id_nod = ${nodeId}`;
  db.query(sql, function (err, data) {
  });
  const response = await axios.post(`https://literate-wolf-precious.ngrok-free.app/post?id_nod=${nodeId}&temp=${temp}&lumina=${light}`);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send("UPDATE");
    }
  });
  res.json({ success: true });
});

app.get("/control", (req, res) => {
  var sql_query = `SELECT control_temp, control_lumina FROM noduri WHERE id_nod = ` + req.query.nodeId + `;`;
  db.query(sql_query, function (err, result, fields) {
    console.log(result)
    if (err) throw err;
    const control_temp = result.map((row) => row.control_temp);
    const control_lumina = result.map((row) => row.control_lumina);
    const jsonData = {
      control_temp: control_temp,
      control_lumina: control_lumina,
    };
    res.json(jsonData);
  });
});

const server = app.listen(process.env.PORT || PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Handle WebSocket connections
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});

server.on('upgrade', function upgrade(request, socket, head) {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request)
  })
});
