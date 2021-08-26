"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var express_1 = __importDefault(require("express"));
var graphql_1 = require("graphql");
var apollo_server_express_1 = require("apollo-server-express");
var graphql_subscriptions_1 = require("graphql-subscriptions");
var subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
var schema_1 = require("@graphql-tools/schema");
var influxdb_client_1 = __importDefault(require("./influxdb/influxdb-client"));
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var typeDefs, influxDBClient, pubsub, resolvers, app, httpServer, schema, server;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                typeDefs = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      type PlcData  {\n        name: String!\n        val: Float!\n        ts: String!\n      }\n\n      type Subscription {\n        subscribe2data(topic: [String]!): PlcData!\n      }\n\n      input DataContent {\n        name: String\n        val: Float\n        ts: String!\n      }\n\n      type Mutation {\n        createData(args: DataContent): Boolean!\n        postMetaData(args: DataContent): Boolean!\n      }\n\n      type Query {\n        measurements: [String]!\n      }\n\n      schema {\n        query: Query\n        subscription: Subscription\n      }\n    "], ["\n      type PlcData  {\n        name: String!\n        val: Float!\n        ts: String!\n      }\n\n      type Subscription {\n        subscribe2data(topic: [String]!): PlcData!\n      }\n\n      input DataContent {\n        name: String\n        val: Float\n        ts: String!\n      }\n\n      type Mutation {\n        createData(args: DataContent): Boolean!\n        postMetaData(args: DataContent): Boolean!\n      }\n\n      type Query {\n        measurements: [String]!\n      }\n\n      schema {\n        query: Query\n        subscription: Subscription\n      }\n    "])));
                influxDBClient = influxdb_client_1.default.getInstance();
                pubsub = new graphql_subscriptions_1.PubSub();
                resolvers = {
                    Query: {
                        measurements: function () {
                            return influxDBClient.getMetaData().then(function (x) { return x; });
                        }
                    },
                    Mutation: {
                        createData: function (parent, _a, context) {
                            var args = _a.args;
                            pubsub.publish(args.name, args);
                            influxDBClient.postMeasurement({ name: args.name, val: args.val, ts: args.ts });
                            console.log(args);
                            return true;
                        }
                    },
                    Subscription: {
                        subscribe2data: {
                            resolve: function (payload) {
                                return {
                                    name: payload.name,
                                    val: payload.val,
                                    ts: new Date(payload.ts).getTime()
                                };
                            },
                            subscribe: function (_, args) { return pubsub.asyncIterator(__spreadArray([], args.topic)); }
                        }
                    }
                };
                app = express_1.default();
                httpServer = http_1.createServer(app);
                schema = schema_1.makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers });
                server = new apollo_server_express_1.ApolloServer({
                    schema: schema,
                });
                return [4 /*yield*/, server.start()];
            case 1:
                _a.sent();
                server.applyMiddleware({ app: app });
                subscriptions_transport_ws_1.SubscriptionServer.create({ schema: schema, execute: graphql_1.execute, subscribe: graphql_1.subscribe }, { server: httpServer, path: server.graphqlPath });
                httpServer.listen(4000, function () {
                    console.log("\uD83D\uDE80 Query endpoint ready at http://localhost:" + 4000 + server.graphqlPath + "ql");
                    console.log("\uD83D\uDE80 Subscription endpoint ready at ws://localhost:" + 4000 + server.graphqlPath + "ql");
                });
                return [2 /*return*/];
        }
    });
}); })();
var templateObject_1;
//# sourceMappingURL=app.js.map