"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataSource = void 0;
var getDataSource = function (msgString) {
    var connectionMap = [];
    var msg = JSON.parse(msgString);
    console.log(typeof (msg));
    if (msg === undefined || msg.seq === undefined || msg.connections === undefined) {
        return null;
    }
    msg.connections.forEach(function (connection) {
        var nameIDMap = [];
        var dataPoints = connection.dataPoints;
        var topicName;
        //  Iterate through dataPoints
        dataPoints.forEach(function (dataPoint) {
            var dataPointDefinitions = dataPoint.dataPointDefinitions;
            topicName = dataPoint.topic;
            // Iterate through dataPointDefinitions
            dataPointDefinitions.forEach(function (dataPointDefinition) {
                nameIDMap.push({ name: dataPointDefinition.name, value: dataPointDefinition.id });
            });
        });
        connectionMap.push({ connectionName: connection.name, topic: topicName, values: nameIDMap });
    });
    return connectionMap;
};
exports.getDataSource = getDataSource;
//# sourceMappingURL=metadata-adapter.js.map