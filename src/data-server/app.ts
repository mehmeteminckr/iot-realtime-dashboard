import { createServer } from "http";
import express from "express";
import { execute, subscribe } from "graphql";
import { ApolloServer, gql } from "apollo-server-express";
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import InfluxDBClient from "./influxdb/influxdb-client";


(async () => {

    const typeDefs = gql`
      type PlcData  {
        name: String!
        val: Float!
        ts: String!
      }

      type Subscription {
        subscribe2data(topic: [String]!): PlcData!
      }

      input DataContent {
        name: String
        val: Float
        ts: String!
      }

      type Mutation {
        createData(args: DataContent): Boolean!
        postMetaData(args: DataContent): Boolean!
      }

      type Query {
        measurements: [String]!
      }

      schema {
        query: Query
        subscription: Subscription
      }
    `;

    const influxDBClient = InfluxDBClient.getInstance();

    const pubsub = new PubSub();

    const resolvers = {
      Query: {
          measurements: () => {
              return influxDBClient.getMetaData().then(x => x);
          }
      },
      Mutation : {
          createData: (parent, {args}, context) => {
            pubsub.publish(args.name,args)
            influxDBClient.postMeasurement({name:args.name,val:args.val,ts:args.ts})
            console.log(args);
            return true
          }
      },
      Subscription: {
          subscribe2data: {
              resolve: (payload) => {
                  return {
                      name: payload.name,
                      val: payload.val,
                      ts: new Date(payload.ts).getTime()
                  };
              },
              subscribe: (_, args) => pubsub.asyncIterator([...args.topic])
          }
      }
    }

  const app = express();

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    
  });
  await server.start();
  server.applyMiddleware({ app });

  SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  httpServer.listen(4000, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${4000}${server.graphqlPath}ql`
    );
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${4000}${server.graphqlPath}ql`
    );
  });

})();



