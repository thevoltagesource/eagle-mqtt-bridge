const mqttclient = require('./mqtt-client.js')
const eagle = require('./eagle-listener.js')
const logger = require('./logger.js')

logger.info('Starting Eagle to MQTT Bridge.')

let regex = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')
const host = regex.test(process.env.MQTT_HOST) ? process.env.MQTT_HOST : null

regex = new RegExp('^true$', 'i')
const discovery = regex.test(process.env.HA_DISCOVERY) ? true : false

regex = new RegExp('^((?![#+]).)+$')
if (!regex.test(process.env.MQTT_TOPIC) && process.env.MQTT_TOPIC) {
  logger.warn('MQTT topic cannot contain "+" or "#" characters')
}
const topic_base = (process.env.MQTT_TOPIC && regex.test(process.env.MQTT_TOPIC)) ? process.env.MQTT_TOPIC : 'eagle'

// Seconds without any POST from the Eagle before it is reported offline.
regex = new RegExp('^\\d+$')
const aliveTimeout = (regex.test(process.env.ALIVE_TIMEOUT) && parseInt(process.env.ALIVE_TIMEOUT, 10) > 0)
  ? parseInt(process.env.ALIVE_TIMEOUT, 10) : 60

const username = process.env.MQTT_USER
const password = process.env.MQTT_PASS

if (!host) {
  logger.error('MQTT_HOST must be a valid IPv4 address.')
  process.exit(1)
}

const mqtt = new mqttclient(host, username, password, topic_base, discovery)

// Eagle availability is published retained so Home Assistant always has the
// current state, even after an HA restart. It is only trustworthy while the
// bridge itself is online, so HA pairs it with the bridge status topic (LWT).
let eagleOnline = false
let aliveTimer = null

function publishAvailability() {
  mqtt.sendMessage('availability', eagleOnline ? 'online' : 'offline', true)
}

function markOffline() {
  aliveTimer = null
  eagleOnline = false
  logger.info(`No data from Eagle for ${aliveTimeout}s, marking Eagle offline`)
  publishAvailability()
}

// Every MQTT (re)connect re-publishes the current state. On startup this is
// 'offline' until the first POST from the Eagle proves it is reporting.
mqtt.on('connect', publishAvailability)
mqtt.connect()

logger.info(`Eagle alive timeout: ${aliveTimeout}s`)

// Any valid POST from the Eagle counts as proof of life, even if it only
// contains message types that are not published.
eagle.on('alive', () => {
  if (!eagleOnline) {
    eagleOnline = true
    logger.info('Receiving data from Eagle, marking Eagle online')
    publishAvailability()
  }
  if (aliveTimer) clearTimeout(aliveTimer)
  aliveTimer = setTimeout(markOffline, aliveTimeout * 1000)
})

eagle.on('message', (message) => {
  Object.keys(message).forEach(function(key) {
    mqtt.sendMessage(key, message[key])
  })
})

// Publish bridge offline immediately on shutdown instead of waiting for the
// broker to fire the LWT after the keep-alive expires.
function shutdown(signal) {
  logger.info(`Received ${signal}, shutting down`)
  mqtt.shutdown(() => process.exit(0))
  setTimeout(() => process.exit(0), 3000).unref()
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
