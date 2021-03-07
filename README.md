# Rainforest Eagle to MQTT bridge
This application creates an HTTP listener to capture XML from the Rainforest Eagle, parse the XML, and publish select data to the specified MQTT host.

This is available as a Docker container and can be found on [Docker Hub](https://hub.docker.com/repository/docker/thevoltagesource/eagle-mqtt-bridge). 
![Docker Pulls](https://img.shields.io/docker/pulls/thevoltagesource/eagle-mqtt-bridge)

Settings are passed to the app through environment variables.

* **MQTT_HOST=ip.ad.re.ss - REQUIRED - IP or FQDN of your MQTT broker.**
* MQTT_TOPIC=eagle - Base MQTT topic for published messages, default is ```eagle```.
* MQTT_USER=username - MQTT username if authentication is required.
* MQTT_PASS=password - MQTT password if authentication is required.
* LISTEN_PORT=3000 - HTTP Port the bridge will listen on, default is ```3000```.
* LOG_LEVEL=debug - Specify desired log level, default is ```info```.

Device status is tracked (```online``` and ```offline```) on topic ```MQTT_TOPIC/availability```

The bridge publishes birth (```online```) and LWT (```offline```) messages to ```MQTT_TOPIC/bridge/status```

Current supported messages:

* Instantanious Demand (in Watts): ```MQTT_TOPIC/meter/demand```
* Summation Delivered (in kWh): ```MQTT_TOPIC/meter/reading```
* Zigbee Status: ```MQTT_TOPIC/zigbee/status```
* Zigbee Signal Strength: ```MQTT_TOPIC/zigbee/signal```
* Zigbee Channel: ```MQTT_TOPIC/zigbee/channel```

Details of most Eagle messages are in the code and can be used to enable additional published data.

