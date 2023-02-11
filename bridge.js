const mqttclient = require('./mqtt-client.js')
const eagle = require('./eagle-listener.js')
const logger = require('./logger.js')

logger.info('Starting Eagle to MQTT Bridge.')

regex = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')
const host = regex.test(process.env.MQTT_HOST) ? process.env.MQTT_HOST : null

regex = new RegExp('^true$', 'i')
const discovery = regex.test(process.env.HA_DISCOVERY) ? true : false

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
  var mqtt = new mqttclient(host, username, password, topic_base, discovery)
  mqtt.connect()
}

var aliveTimeout;
var firstMsg;

function isalive(alive) {
  if (alive) {
    if (!aliveTimeout || firstMsg) {
      mqtt.sendMessage('availability', 'online')
      firstMsg = false
    } else {
      clearTimeout(aliveTimeout);
    }
    aliveTimeout = setTimeout(isalive, 15000, false);
  }
  if (!alive && aliveTimeout) {
    mqtt.sendMessage('availability', 'offline')
    clearTimeout(aliveTimeout);
    aliveTimeout = null;
  }
}

aliveTimeout = setTimeout(isalive, 15000, false)
firstMsg = true 

eagle.on('message', (message) => {
  isalive(true)
  Object.keys(message).forEach(function(key) {
    mqtt.sendMessage(key, message[key])
  })
})
