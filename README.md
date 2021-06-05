# Rainforest Eagle to MQTT bridge
![Docker Pulls](https://img.shields.io/docker/pulls/thevoltagesource/eagle-mqtt-bridge)<br>
This application creates an HTTP listener to capture XML from the Rainforest Eagle, parse the XML, and publish select data to the specified MQTT host. This is available as a Docker container on [Docker Hub](https://hub.docker.com/repository/docker/thevoltagesource/eagle-mqtt-bridge).  

Settings are passed to the app through environment variables.

* **MQTT_HOST=ip.ad.re.ss - REQUIRED - IP of your MQTT broker.**
* MQTT_TOPIC=eagle - Base MQTT topic for published messages, default is ```eagle```.
* MQTT_USER=username - MQTT username if authentication is required.
* MQTT_PASS=password - MQTT password if authentication is required.
* LISTEN_PORT=3000 - HTTP Port the bridge will listen on, default is ```3000```.
* LOG_LEVEL=info - Specify desired log level, default is ```info```.
* SUMMATION_WATTS=false - Set to ```true``` for summation values in Watt Hours (Wh), default is ```false``` for Kilowatt Hours (kWh)

Device status is tracked (```online``` and ```offline```) on topic ```MQTT_TOPIC/availability```<br>
Bridge status is tracked (```online``` and ```offline```) on topic```MQTT_TOPIC/bridge/status``` (retained)

Current supported messages:<br>
* Instantanious Demand (in Watts): ```MQTT_TOPIC/meter/demand```
* Summation Delivered (rounded to neaest kWh or Wh): ```MQTT_TOPIC/meter/delivered```
* Summation Received (rounded to nearest kWh or Wh): ```MQTT_TOPIC/meter/received```
* Price / kWh (set by utility or manually entered): ```MQTT_TOPIC/pricing/price```
* Price Tier : ```MQTT_TOPIC/pricing/tier```
* Zigbee Status: ```MQTT_TOPIC/zigbee/status```
* Zigbee Signal Strength: ```MQTT_TOPIC/zigbee/signal```
* Zigbee Channel: ```MQTT_TOPIC/zigbee/channel```

Please note the Meter Reading topic was dropped in favor of the Summation Delivered topic.

Details of most Eagle messages are in the code and can be used to enable additional published data.
