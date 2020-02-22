const mqtt = require('mqtt')
const logger = require('./logger.js');

class MqttClient {
  constructor(host, username, password, topic_base) {
    this.client = null
    this.topic_base = topic_base
    this.host = 'mqtt://'+ host
    if (username && password) {
      this.username = username
      this.password = password
    } else {
      logger.warn(`No authentication for MQTT connection specified`)
    }
  }

  connect() {
    var connectOptions = {
        will: {topic: this.topic_base + '/availability', payload: 'Offline', retain: true}
    }
    if (this.username) {
      connectOptions.username = this.username
      connectOptions.password = this.password
    }

    logger.info("Connecting to " + this.host)
    this.client = mqtt.connect(this.host, connectOptions)

    this.client.on('error', (err) => {
      logger.error("\x1b[31m%s\x1b[0m", 'MQTT Error: ' + err.message)
      this.client.end()
    })

    this.client.on('connect', () => {
      logger.info('MQTT client connected')
      logger.info('Publishing to topic base: ' + this.topic_base)
      this.client.publish(this.topic_base + '/availability', 'Online', {retain: true})
    })

    this.client.on('close', () => {
      logger.info('MQTT client connection closed')
    })
  }

  sendMessage(topic, message) {
      this.client.publish(this.topic_base + '/' + topic, message.toString())
  }
}

module.exports = MqttClient