# Rainforest Eagle to MQTT bridge
This code creates an HTTP listener to capture XML from the Rainforest Eagle, parses the XML, and publish select data to the specified MQTT host.

The goal is to run this code in a Docker container.

Settings are passed to the app through environment variables.

* LISTEN_PORT=3000 - Port of your choice
* MQTT_HOST=ip.ad.re.ss - IP or FQDN of your MQTT broker
* MQTT_TOPIC=eagle - Choose the base MQTT topic for the published messages
* MQTT_USER=username - Optional
* MQTT_PASS=password - Optional

Publishes Birth ('Online') and LWT ('Offline') messages to MQTT_TOPIC/availability

Current supported messages:

* Instantanious Demand (in Watts): MQTT_TOPIC/meter/demand
* Summation Delivered (in kWh): MQTT_TOPIC/meter/reading
* Zigbee Status: MQTT_TOPIC/status
* Zigbee Signal Strength: MQTT_TOPIC/signal
* Zigbee Channel: MQTT_TOPIC/channel

Details of most Eagle messages are in the code and can be used to enable additional published data.

