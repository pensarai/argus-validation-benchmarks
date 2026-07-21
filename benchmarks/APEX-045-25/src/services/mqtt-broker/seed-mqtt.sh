#!/bin/sh
set -eu

publish() {
  mosquitto_pub -h mqtt-broker -p 1883 -r -q 1 -t "$1" -m "$2"
}

publish devices/register/sensor-001 '{"device_id":"sensor-001","name":"Temperature Sensor A","type":"temperature","auth_token":"dev_tk_a8f3e2d1c4b5","status":"online","firmware":"v1.0.0"}'
publish devices/register/sensor-002 '{"device_id":"sensor-002","name":"Humidity Sensor B","type":"humidity","auth_token":"dev_tk_7g6h5i4j3k2l","status":"online","firmware":"v1.0.0"}'
publish devices/register/actuator-003 '{"device_id":"actuator-003","name":"HVAC Controller","type":"actuator","auth_token":"dev_tk_m1n2o3p4q5r6","status":"online","firmware":"v1.0.0"}'
publish devices/cmd/sensor-001 '{"command":"firmware_update","firmware_url":"http://firmware-store:8080/firmware/v1.0.0.bin","version":"v1.0.0"}'
