const mqttclient = require('./mqtt-client.js')
const eagle = require('./eagle-listener.js')
const logger = require('./logger.js')

logger.info('Starting Eagle to MQTT Bridge.')

regex = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')
const host = regex.test(process.env.MQTT_HOST) ? process.env.MQTT_HOST : null

regex = new RegExp('^((?![#+]).)+$') 
if (!regex.test(process.env.MQTT_TOPIC) && process.env.MQTT_TOPIC) {
  logger.warn('MQTT topic cannot contain "+" or "#" characters')
}
const topic_base = (process.env.MQTT_TOPIC && regex.test(process.env.MQTT_TOPIC)) ? process.env.MQTT_TOPIC : 'eagle'

const username = process.env.MQTT_USER
const password = process.env.MQTT_PASS

if (!host) {
  logger.error('MQTT_HOST must be a valid IPv4 address.')
  process.exit()
} else {
  var mqtt = new mqttclient(host, username, password, topic_base);
  mqtt.connect();
}

var wasalive = true

function isalive(alive) {
  if (alive) {
    if (wasalive) {
      mqtt.sendMessage('availability', 'online')
    }
    wasalive = true
  }
  if (!alive) {
    if (!wasalive) {
      mqtt.sendMessage('availability', 'offline')
    }
    wasalive=false
  }
}

setInterval(isalive, 15000, false)

eagle.on('message', (message) => {
  Object.keys(message).forEach(function(key) {
    mqtt.sendMessage(key, message[key])
  })
  isalive(true)
})
