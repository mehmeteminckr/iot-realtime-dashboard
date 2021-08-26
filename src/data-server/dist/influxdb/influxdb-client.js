"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var env_config_json_1 = __importDefault(require("../config/env-config.json"));
var influx_1 = require("influx");
var InfluxDBClient = /** @class */ (function () {
    function InfluxDBClient() {
        this.influx = new influx_1.InfluxDB({
            host: env_config_json_1.default.HOST,
            database: env_config_json_1.default.DATABASE,
            port: Number(env_config_json_1.default.PORT),
            username: env_config_json_1.default.USERNAME,
            password: env_config_json_1.default.PASSWORD,
            schema: [
                {
                    measurement: "uihqiuwhe",
                    fields: {
                        value: influx_1.FieldType.FLOAT
                    },
                    tags: [
                        'host'
                    ]
                }
            ]
        });
    }
    InfluxDBClient.getInstance = function () {
        if (!InfluxDBClient.instance) {
            InfluxDBClient.instance = new InfluxDBClient();
        }
        return InfluxDBClient.instance;
    };
    InfluxDBClient.prototype.getMetaData = function () {
        return this.influx.getMeasurements(env_config_json_1.default.DATABASE).then(function (x) {
            console.log(x);
            return x;
        });
    };
    InfluxDBClient.prototype.getMeasurement = function (msrmt) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var influxQL = "select * from \"" + msrmt + "\"";
            _this.influx.query(influxQL)
                .then(function (res) {
                console.log(res[0]);
                console.log(new Date(res[0].time).getTime());
                var data = res.filter(function (x) { return x.time != undefined && x.value != undefined; })
                    .map(function (y) { return [new Date(y.time).getTime(), y.value]; });
                console.log(data, "asdasdasds");
                resolve(data);
            });
        });
    };
    InfluxDBClient.prototype.postMeasurement = function (_a) {
        var name = _a.name, val = _a.val, ts = _a.ts;
        this.influx.writePoints([
            {
                measurement: name,
                fields: { value: Number(val) },
                timestamp: new Date(ts).getTime()
            }
        ])
            .catch(function (error) {
            console.error("Data-Collector: Error saving data to InfluxDB! " + error.stack);
        });
    };
    return InfluxDBClient;
}());
exports.default = InfluxDBClient;
//# sourceMappingURL=influxdb-client.js.map