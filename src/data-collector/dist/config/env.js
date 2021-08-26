"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var env_config_json_1 = __importDefault(require("./env-config.json"));
var env = {};
if (env_config_json_1.default.MQTT !== undefined) {
    env.MQTT_DEFAULT_TOPICNAME = env_config_json_1.default.MQTT.DEFAULT_METADATA_TOPIC_NAME;
    env.MQTT_HOST = env_config_json_1.default.MQTT.HOST;
    env.MQTT_PORT = Number(env_config_json_1.default.MQTT.PORT);
    env.MQTT_USERNAME = env_config_json_1.default.MQTT.USERNAME;
    env.MQTT_PASSWORD = env_config_json_1.default.MQTT.PASSWORD;
    env.MQTT_DATASOURCES = env_config_json_1.default.MQTT.DATA_SOURCES;
}
if (env_config_json_1.default.INFLUXDB !== undefined) {
    env.INFLUXDB_HOST = env_config_json_1.default.INFLUXDB.HOST;
    env.INFLUXDB_PORT = Number(env_config_json_1.default.INFLUXDB.PORT);
    env.INFLUXDB_DATABASE = env_config_json_1.default.INFLUXDB.DATABASE;
}
exports.default = env;
//# sourceMappingURL=env.js.map