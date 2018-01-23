/**
 *  Yeti 
 *
 *  Copyright 2018 Netbeast
 *
 */
definition(
    name: "Yeti ",
    namespace: "Netbeast",
    author: "Netbeast",
    description: "Yeti is a smart home app that allows you to control different smart home devices from a single interface",
    category: "Convenience",
    iconUrl: "https://s3.amazonaws.com/smartapp-icons/Convenience/Cat-Convenience.png",
    iconX2Url: "https://s3.amazonaws.com/smartapp-icons/Convenience/Cat-Convenience@2x.png",
    iconX3Url: "https://s3.amazonaws.com/smartapp-icons/Convenience/Cat-Convenience@2x.png")


preferences {
	section("Allow Yeti Access to These Things...") {
        input "switches", "capability.switch", title: "Switch", required: false, multiple: true
        input "motions", "capability.motionSensor", title: "Motion", required: false, multiple: true
        input "temperatures", "capability.temperatureMeasurement", title: "Temperature", required: false, multiple: true
        input "humidities", "capability.relativeHumidityMeasurement", title: "Humidity", required: false, multiple: true
        input "contacts", "capability.contactSensor", title: "Contact", required: false, multiple: true
        input "accelerations", "capability.accelerationSensor", title: "Acceleration", required: false, multiple: true
        input "presences", "capability.presenceSensor", title: "Presence", required: false, multiple: true
        input "batteries", "capability.battery", title: "Battery", required: false, multiple: true
        input "threeaxes", "capability.threeAxis", title: "3 Axis", required: false, multiple: true
        /*
        input "accelerationSensor", "capability.accelerationSensor", title: "Acceleration Sensor", required: false, multiple: true
		input "alarm", "capability.alarm", title: "Alarm", required: false, multiple: true
		input "battery", "capability.battery", title: "Battery", required: false, multiple: true
		input "beacon", "capability.beacon", title: "Beacon", required: false, multiple: true
		input "button", "capability.button", title: "Button", required: false, multiple: true
		input "carbonMonoxideDetector", "capability.carbonMonoxideDetector", title: "Carbon Monoxide Detector", required: false, multiple: true
		input "colorControl", "capability.colorControl", title: "Color Control", required: false, multiple: true
		input "contactSensor", "capability.contactSensor", title: "Contact Sensor", required: false, multiple: true
		input "doorControl", "capability.doorControl", title: "Door Control", required: false, multiple: true
		input "energyMeter", "capability.energyMeter", title: "Energy Meter", required: false, multiple: true
		input "illuminanceMeasurement", "capability.illuminanceMeasurement", title: "Illuminance Measurement", required: false, multiple: true
		input "imageCapture", "capability.imageCapture", title: "Image Capture", required: false, multiple: true
		input "indicator", "capability.indicator", title: "Indicator", required: false, multiple: true
		input "locationMode", "capability.locationMode", title: "Location Mode", required: false, multiple: true
		input "lock", "capability.lock", title: "Lock", required: false, multiple: true
		input "mediaController", "capability.mediaController", title: "Media Controller", required: false, multiple: true
		input "motionSensor", "capability.motionSensor", title: "Motion Sensor", required: false, multiple: true
		input "musicPlayer", "capability.musicPlayer", title: "Music Player", required: false, multiple: true
		input "powerMeter", "capability.powerMeter", title: "Power Meter", required: false, multiple: true
		input "presenceSensor", "capability.presenceSensor", title: "Presence Sensor", required: false, multiple: true
		input "relativeHumidityMeasurement", "capability.relativeHumidityMeasurement", title: "Relative Humidity Measurement", required: false, multiple: true
		input "relaySwitch", "capability.relaySwitch", title: "Relay Switch", required: false, multiple: true
		input "sensor", "capability.sensor", title: "Sensor", required: false, multiple: true
		input "signalStrength", "capability.signalStrength", title: "Signal Strength", required: false, multiple: true
		input "sleepSensor", "capability.sleepSensor", title: "Sleep Sensor", required: false, multiple: true
		input "smokeDetector", "capability.smokeDetector", title: "Smoke Detector", required: false, multiple: true
		input "speechRecognition", "capability.speechRecognition", title: "Speech Recognition", required: false, multiple: true
		input "stepSensor", "capability.stepSensor", title: "Step Sensor", required: false, multiple: true
		input "switchv", "capability.switch", title: "Switch", required: false, multiple: true
		input "switchLevel", "capability.switchLevel", title: "Switch Level", required: false, multiple: true
		input "temperatureMeasurement", "capability.temperatureMeasurement", title: "Temperature Measurement", required: false, multiple: true
		input "thermostat", "capability.thermostat", title: "Thermostat", required: false, multiple: true
		input "thermostatCoolingSetpoint", "capability.thermostatCoolingSetpoint", title: "Thermostat Cooling Setpoint", required: false, multiple: true
		input "threeAxis", "capability.threeAxis", title: "Three Axis", required: false, multiple: true
		input "touchSensor", "capability.touchSensor", title: "TouchSensor", required: false, multiple: true
		input "valve", "capability.valve", title: "Valve", required: false, multiple: true
		input "waterSensor", "capability.waterSensor", title: "Water Sensor", required: false, multiple: true
        */
    }
}

mappings {
	path("/getDevices") {
    	action: [
        	GET: "listAllDevices"
        ]
    }
    path("/getHubs") {
    	action: [
        	GET: "getHubInfo"
        ]
    }
    path("/:type") {
        action: [
            GET: "listDevices"
        ]
    }
    path("/:type/:id/getStatus/") {
    	action: [
        	GET: "getStatus"
        ]
    }
    path("/:type/:id/:cmd") {
    	action: [
            GET: "updateDevice"
        ]
    }
}

def installed() {
	log.debug "Installed with settings: ${settings}"
	subscribeToEvents()
	initialize()
}

def updated() {
	log.debug "Updated with settings: ${settings}"

	unsubscribe()
    subscribeToEvents()
	initialize()
}

def initialize() {
    try {
        // foo doesn't exist, causing exception
        foo.boom()
    } catch (e) {
        log.error("caught exception", e)
    }
	subscribe(app, eventHandler)
}

// TODO: implement event handlers
private device_to_json(device, type) {
    if (!device) {
        return;
    }
    def values = [:]
    def json_dict = [id: device.id, label: device.label, type: type, typeName: device.getTypeName(), model: device.getModelName(),status: device.getStatus(), value: device.currentState(type)];

    def s = device.currentState(type)
    values['timestamp'] = s?.isoDate

    switch(type) {
        case "switch":
            values['state'] = (s?.value == "on")
            break
        case "motion":
            values['state'] = (s?.value == "active")
            break
        case "temperature":
            values['state'] = s?.value.toFloat()
            break
        case "humidity":
            values['state'] = s?.value.toFloat()
            break
        case "contact":
            values['state'] = (s?.value == "closed")
            break
        case "acceleration":
            values['state'] = (s?.value == "active")
            break
        case "presence":
            values['state'] = (s?.value == "present")
            break
        case "battery":
            values['state'] = s?.value.toFloat() / 100.0
            break
        case "threeAxis":
            values['x'] = s?.xyzValue?.x
            values['y'] = s?.xyzValue?.y
            values['z'] = s?.xyzValue?.z
            break
    }

    json_dict
}

def devices_for_type(type) {
    [
        switch:       switches,
        motion:       motions,
        temperature:  temperatures,
        humidity:     humidities,
        contact:      contacts,
        acceleration: accelerations,
        presence:     presences,
        battery:      batteries,
        threeAxis:    threeaxes,
    ][type]
}

def listDevices() {
    devices_for_type(params.type).collect {
        device_to_json(it, params.type)
    }
}

def listAllDevices() {
    def devices = settings
    def keys = settings.keySet()
    def devices_type_sing = ["switch",
        	"motion",
    		"temperature",
    		"humidity",
    		"contact",
    		"acceleration",
    		"presence",
    		"battery",
    		"threeAxis",
            "light"]
    def deviceList = []           
    for (type in devices_type_sing) {
    	def aux = devices_for_type(type).collect {
     		device_to_json(it,type)
     	}
        if(aux != []) {
        	deviceList.push(aux)
        }
    }
    return deviceList
    
    // settings // This will return all devices
    // switches.currentValue("switch") // Resturn current Value of switches
   	// location.hubs // Get hub info
   	// switches.getModelName() // Get Model of devices
    // switches.getTypeName() // Name of Hue device type
}

def updateDevice() {
    def dev = devices_for_type(params.type).find { it.id == params.id }
    if (!dev) {
        httpError(404, "Device not found")
    } else {
    	log.debug "Changed switch status"
        dev."$params.cmd"()
    }
}

def getHubInfo () {
	location.hubs
}

def getStatus () {
   	def status = devices_for_type(params.type).collect {
        if(it.id == params.id) {
        return it.getStatus()
       } 
    }
    return status-null
}

/* Subscribe to events function */

def subscribeToEvents() {
    subscribe(switches, "switch", eventHandler)
    subscribe(motions, "motion", eventHandler)
    subscribe(temperatures, "temperature", eventHandler)
    subscribe(humidities, "humidity", eventHandler)
    subscribe(contacts, "contact", eventHandler)
    subscribe(presences, "presence", eventHandler)
    subscribe(batteries, "batterie", eventHandler)
}

/**
 * EventHandler!!
 * 
 * This is the function that communicates externally. 
 * There are 3 parts:
 *  1) Create the json object
 *  2) Create the request params object (including URL)
 *  3) make the request to webhook URL
 */
def eventHandler(evt) {
    def state_changed = evt.isStateChange()
    def webhookUrl = "https://fuzzy-satin.glitch.me/"
	def json_body = [
            id: evt.deviceId, 
			date: evt.isoDate,
        	value: evt.value, 
            name: evt.name, 
            display_name: evt.displayName, 
            description: evt.descriptionText,
            source: evt.source, 
            state_changed: evt.isStateChange(),
            physical: evt.isPhysical(),
            location_id: evt.locationId,
            hub_id: evt.hubId, 
            smartapp_id: evt.installedSmartAppId
        ] 

	def json_params = [
  		uri: webhookUrl,
  		success: successClosure,
	  	body: json_body
	]
    
    try {
		httpPostJson(json_params)
	} catch (e) {
    	log.error "http post failed: $e"
	}
}