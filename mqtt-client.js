const mqtt = require('mqtt')

class MqttClient {
  constructor(host, username, password, topic_base) {
    this.client = null
    this.topic_base = topic_base
    this.host = 'mqtt://'+ host
    //this.protocol = 'YOUR_PROTOCOL'
    //this.port = 'YOUR PORT'
    if (username && password) {
      this.username = username
      this.password = password
    } else {

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

    console.log("Connecting to " + this.host)
    this.client = mqtt.connect(this.host, connectOptions)

    this.client.on('error', (err) => {
      console.log("\x1b[31m%s\x1b[0m", 'MQTT Error: ' + err.message)
      this.client.end()
    })

    this.client.on('connect', () => {
      console.log('MQTT client connected')
      this.client.publish(this.topic_base + '/availability', 'Online', {retain: true})
    })

    this.client.on('close', () => {
      console.log('MQTT client not connected')
    })
  }

  sendMessage(topic, message) {
      this.client.publish(this.topic_base + '/' + topic, message.toString())
  }
}

module.exports = MqttClient