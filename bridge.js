const mqttclient = require('./mqtt-client.js')
const eagle = require('./eagle-listener.js')
const logger = require('./logger.js')
const topic_base = process.env.MQTT_TOPIC ? process.env.MQTT_TOPIC : 'eagle'
logger.info('Starting Eagle to MQTT Bridge.')

const host = process.env.MQTT_HOST
const username = process.env.MQTT_USER
const password = process.env.MQTT_PASS

if (!host) {
  logger.error('MQTT_HOST not specified.')
} else {
  var mqtt = new mqttclient(host, username, password, topic_base);
  mqtt.connect();
}

var wasalive = true

function isalive(alive) {
  if (alive) {
    if (wasalive) {
      mqtt.sendMessage('availability', 'online', true)
    }
    wasalive = true
    logger.info('alive')
  }
  if (!alive) {
    if (!wasalive) {
      mqtt.sendMessage('availability', 'offline', true)
    }
    wasalive=false
    logger.info('dead')
  }
}

setInterval(isalive, 15000, false)

eagle.on('message', (message) => {
  Object.keys(message).forEach(function(key) {
    mqtt.sendMessage(key, message[key])
  })
  isalive(true)
})
