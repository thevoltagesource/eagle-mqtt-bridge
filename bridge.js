const mqttclient = require('./mqtt-client.js')
const eagle = require('./eagle-listener.js')

const host = process.env.MQTT_HOST
const username = process.env.MQTT_USER
const password = process.env.MQTT_PASS
const topic_base = process.env.MQTT_TOPIC

if (!host) {
  console.log('MQTT host not specified')
} else {
  var mqtt = new mqttclient(host, username, password, topic_base);
  mqtt.connect();
}


eagle.on('message', (message) => {
  Object.keys(message).forEach(function(key) {
    mqtt.sendMessage(key, message[key])
  })
})
