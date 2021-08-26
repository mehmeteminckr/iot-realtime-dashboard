import configJson from "./env-config.json";

export interface ConfigurationInterface {
    MQTT_DEFAULT_TOPICNAME?;
    MQTT_HOST?:string;
    MQTT_PORT?:number;
    MQTT_USERNAME?:string;
    MQTT_PASSWORD?:string;
    MQTT_DATASOURCES?:string[];
    INFLUXDB_HOST?:string;
    INFLUXDB_PORT?:number;
    INFLUXDB_DATABASE?:string;
}

let env: ConfigurationInterface = {};

if (configJson.MQTT !== undefined) {
    env.MQTT_DEFAULT_TOPICNAME = configJson.MQTT.DEFAULT_METADATA_TOPIC_NAME;
    env.MQTT_HOST = configJson.MQTT.HOST;
    env.MQTT_PORT = Number(configJson.MQTT.PORT);
    env.MQTT_USERNAME = configJson.MQTT.USERNAME;
    env.MQTT_PASSWORD = configJson.MQTT.PASSWORD;
    env.MQTT_DATASOURCES = configJson.MQTT.DATA_SOURCES;
}

if (configJson.INFLUXDB !== undefined) {
    env.INFLUXDB_HOST = configJson.INFLUXDB.HOST;
    env.INFLUXDB_PORT = Number(configJson.INFLUXDB.PORT);
    env.INFLUXDB_DATABASE = configJson.INFLUXDB.DATABASE;
}
    
export default env;