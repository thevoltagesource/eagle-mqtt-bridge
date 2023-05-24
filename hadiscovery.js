var messageset = {}

function buildDiscovery(topic_base) {
	regex = new RegExp('^true$', 'i')
	const hires = regex.test(process.env.SUMMATION_WATTS) ? true : false
	const summationunit = hires ? 'Wh' : 'kWh'

	const eagle_device = {
	  "payload_available": "online",
	  "payload_not_available": "offline",
	  "device": {
	    "identifiers": [
	      "rfeagle"
	    ],
	    "name": "Rainforest Eagle",
	    "manufacturer": "Rainforest Automation",
	    "model": "Eagle",
	    "via_device": "Eagle to MQTT Bridge"
	  }
	}
	eagle_device["availability_topic"] = topic_base + "/availability"


	const bridge_topic = 'homeassistant/binary_sensor/tvs_bridge_status/config'
	const bridge_message = {
	  "name": "Eagle to MQTT Bridge Status",
	  "unique_id": "tvs_bridge_status",
	  "payload_on": "online",
	  "payload_off": "offline",
	  "device": {
	    "identifiers": [
	      "tvse2m"
	    ],
	    "name": "Eagle to MQTT Bridge",
	    "manufacturer": "The Voltage Source",
	    "model": "Software bridge",
	    "sw_version": "1.3.0"
	  },
	  "device_class": "running"
	}
	bridge_message["state_topic"] = topic_base + "/bridge/status"

	const eagle_meter_demand_topic = 'homeassistant/sensor/rfeagle_meter_demand/config'
	const eagle_meter_demand_message = {
	  ...eagle_device,
	  "name": "Rainforest Eagle Energy Demand",
	  "unique_id": "rfeagle_demand",
	  "unit_of_measurement": "W",
	  "device_class": "power"  
	}
	eagle_meter_demand_message["state_topic"] = topic_base + "/meter/demand"

	const eagle_meter_delivered_topic = 'homeassistant/sensor/rfeagle_meter_delivered/config'
	const eagle_meter_delivered_message = {
	  ...eagle_device,
	  "name": "Rainforest Eagle Energy Delivered",
	  "unique_id": "rfeagle_delivered",
	  "unit_of_measurement": summationunit,
	  "state_class": "total_increasing",
	  "device_class": "energy"
	}
	eagle_meter_delivered_message["state_topic"] = topic_base + "/meter/delivered"

	const eagle_meter_received_topic = 'homeassistant/sensor/rfeagle_meter_received/config'
	const eagle_meter_received_message = {
	  ...eagle_device,
	  "name": "Rainforest Eagle Energy Received",
	  "unique_id": "rfeagle_received",
	  "unit_of_measurement": summationunit,
	  "device_class": "energy"  
	}
	eagle_meter_received_message["state_topic"] = topic_base + "/meter/received"

	const eagle_pricing_price_topic = 'homeassistant/sensor/rfeagle_pricing_price/config'
	const eagle_pricing_price_message = {
	  ...eagle_device,
	  "name": "Rainforest Eagle Price",
	  "unique_id": "rfeagle_price",
	  "unit_of_measurement": "$/kWh",
	  "device_class": "monetary"  
	}
	eagle_pricing_price_message["state_topic"] = topic_base + "/pricing/price"

	const eagle_pricing_tier_topic = 'homeassistant/sensor/rfeagle_pricing_tier/config'
	const eagle_pricing_tier_message = {
	  ...eagle_device,
	  "name": "Rainforest Eagle Pricing Tier",
	  "unique_id": "rfeagle_price_tier"
	}
	eagle_pricing_tier_message["state_topic"] = topic_base + "/pricing/tier"

	const eagle_zigbee_status_topic = 'homeassistant/binary_sensor/rfeagle_zigbee_status/config'
	const eagle_zigbee_status_message = {
	  ...eagle_device,
	  "name": "Rainforest Eagle Zigbee Status",
	  "unique_id": "rfeagle_zigbee_status",
	  "payload_on": "Connected",
	  "payload_off": "Disconnected",
	  "device_class": "connectivity",
	  "entity_category": "diagnostic"
	}
	eagle_zigbee_status_message["state_topic"] = topic_base + "/zigbee/status"

	const eagle_zigbee_signal_topic = 'homeassistant/sensor/rfeagle_zigbee_signal/config'
	const eagle_zigbee_signal_message = {
	  ...eagle_device,
	  "name": "Rainforest Eagle Zigbee Signal",
	  "unique_id": "rfeagle_zigbee_signal",
	  "unit_of_measurement": "%",
	  "entity_category": "diagnostic"
	}
	eagle_zigbee_signal_message["state_topic"] = topic_base + "/zigbee/signal"

	const eagle_zigbee_channel_topic = 'homeassistant/sensor/rfeagle_zigbee_channel/config'
	const eagle_zigbee_channel_message = {
	  ...eagle_device,
	  "name": "Rainforest Eagle Zigbee Channel",
	  "unique_id": "rfeagle_zigbee_channel",
	  "entity_category": "diagnostic"
	}
	eagle_zigbee_channel_message["state_topic"] = topic_base + "/zigbee/channel"

	messageset[bridge_topic] = JSON.stringify(bridge_message)
	messageset[eagle_meter_demand_topic] = JSON.stringify(eagle_meter_demand_message)
	messageset[eagle_meter_delivered_topic] = JSON.stringify(eagle_meter_delivered_message),
	messageset[eagle_meter_received_topic] = JSON.stringify(eagle_meter_received_message),
	messageset[eagle_pricing_price_topic] = JSON.stringify(eagle_pricing_price_message),
	messageset[eagle_pricing_tier_topic] = JSON.stringify(eagle_pricing_tier_message),
	messageset[eagle_zigbee_status_topic] = JSON.stringify(eagle_zigbee_status_message),
	messageset[eagle_zigbee_signal_topic] = JSON.stringify(eagle_zigbee_signal_message),
	messageset[eagle_zigbee_channel_topic] = JSON.stringify(eagle_zigbee_channel_message)
}

module.exports = { buildDiscovery, messageset }
