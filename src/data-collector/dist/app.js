"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mqtt_1 = require("mqtt");
var env_1 = __importDefault(require("./config/env"));
var metadata_adapter_1 = require("./helpers/metadata-adapter");
var core_1 = require("@apollo/client/core");
var cross_fetch_1 = __importDefault(require("cross-fetch"));
var apolloClient = new core_1.ApolloClient({
    link: new core_1.HttpLink({ uri: 'http://localhost:4000/graphql', fetch: cross_fetch_1.default, credentials: 'same-origin', }),
    cache: new core_1.InMemoryCache()
});
var mqttDataTopic = env_1.default.MQTT_DEFAULT_TOPICNAME;
//read from databus
/* MQTT Connection Option */
var options = {
    'clientId': 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    'protocolId': 'MQTT',
    'username': env_1.default.MQTT_USERNAME,
    'password': env_1.default.MQTT_PASSWORD
};
var dataMap = [];
/* Connect MQTT-Client to Databus (MQTT-Broker) */
var client = mqtt_1.connect('mqtt://' + env_1.default.MQTT_HOST, options);
/* Subscribe to Topic after connection is established */
client.on('connect', function () {
    console.log('Connected to ' + env_1.default.MQTT_HOST);
    client.subscribe(mqttDataTopic, function () {
        console.log('Data-Collector: MQTT: Subscribed to ' + mqttDataTopic);
    });
});
/* Write Data to InfluxDB after recieved message*/
client.on('message', function (topic, message) {
    var msg = JSON.parse(message.toString());
    console.log("Data-Collector: MQTT: Recieved message " + msg + " on MQTT-Topic " + topic + " responding with corresponding answer");
    // write msg to influx
    if (topic === env_1.default.MQTT_DEFAULT_TOPICNAME) {
        var res = metadata_adapter_1.getDataSource(msg);
        console.log(res);
        if (res) {
            dataMap = res;
            res.forEach(function (x) {
                if (env_1.default.MQTT_DATASOURCES.includes(x.connectionName)) {
                    client.subscribe(x.topic);
                }
            });
        }
        console.log(dataMap);
    }
    else {
        var jsonmsg = JSON.parse(msg);
        jsonmsg.vals.forEach(function (element) {
            var nameIDMap = dataMap.find(function (x) { return x.topic === topic.toString(); }).values.find(function (y) { return y.value === element.id; });
            console.log(nameIDMap, "dsfsdfsdsdf", element);
            var mutationGql = core_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n              mutation CreateData($createDataArgs: DataContent!) {\n                createData(args: $createDataArgs)\n              }\n            "], ["\n              mutation CreateData($createDataArgs: DataContent!) {\n                createData(args: $createDataArgs)\n              }\n            "])));
            apolloClient.mutate({ mutation: mutationGql, variables: { createDataArgs: { name: nameIDMap.name, val: element.val, ts: element.ts } } }).then().catch(function (e) { return console.log(JSON.stringify(e)); });
        });
    }
});
var templateObject_1;
//# sourceMappingURL=app.js.map