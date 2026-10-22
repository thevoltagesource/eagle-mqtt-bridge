# Rainforest Eagle to MQTT bridge
![Docker Pulls](https://img.shields.io/docker/pulls/thevoltagesource/eagle-mqtt-bridge)<br>
This application creates an HTTP listener to capture XML from the Rainforest Eagle, parse the XML, and publish select data to the specified MQTT host. This is available as a Docker container on [Docker Hub](https://hub.docker.com/repository/docker/thevoltagesource/eagle-mqtt-bridge).  

[Home Assistant](https://www.home-assistant.io) users can now skip the manual YAML config by enabling discovery!  This will create two devices under the MQTT integration. One for the bridge and one for the Eagle.

Settings are passed to the app through environment variables.

* **MQTT_HOST=ip.ad.re.ss - REQUIRED - IP of your MQTT broker.**
* MQTT_TOPIC=eagle - Base MQTT topic for published messages, default is ```eagle```.
* MQTT_USER=username - MQTT username if authentication is required.
* MQTT_PASS=password - MQTT password if authentication is required.
* LISTEN_PORT=3000 - HTTP Port the bridge will listen on, default is ```3000```.
* LOG_LEVEL=info - Specify desired log level, default is ```info```.
* SUMMATION_WATTS=false - Set to ```true``` for summation values in Watt Hours (Wh), default is ```false``` for Kilowatt Hours (kWh)
* HA_DISCOVERY=false - Set to ```true``` to publish Home Assistant discovery messages.
* ALIVE_TIMEOUT=60 - Seconds without any data from the Eagle before it is reported offline, default is ```60```.

Bridge status is tracked (```online``` and ```offline```) on topic ```MQTT_TOPIC/bridge/status``` (retained). The broker sets it to ```offline``` (Last Will) if the bridge disconnects unexpectedly.<br>
Eagle status is tracked (```online``` and ```offline```) on topic ```MQTT_TOPIC/availability``` (retained). It is ```offline``` when the bridge starts, ```online``` as soon as the Eagle sends data, and ```offline``` again after ```ALIVE_TIMEOUT``` seconds without data. It is only meaningful while the bridge status is ```online```.

With discovery enabled, the Eagle sensors are available only when both topics are ```online```. A **Rainforest Eagle Reporting** binary sensor is also created: ```on``` when the Eagle is sending data, ```off``` when the bridge is running but the Eagle is silent, and unavailable when the bridge is down. It can be used to trigger an automation, such as power-cycling a locked-up Eagle.

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
