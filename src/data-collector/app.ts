import { connect } from 'mqtt';
import env from './config/env';
import { DataMapInterface, getDataSource } from './helpers/metadata-adapter';
import { ApolloClient, HttpLink, InMemoryCache , gql} from '@apollo/client/core';
import fetch from 'cross-fetch';

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql', fetch:fetch,credentials: 'same-origin',}),
  cache: new InMemoryCache()
});


const mqttDataTopic = env.MQTT_DEFAULT_TOPICNAME;
//read from databus
/* MQTT Connection Option */
const options = {
  'clientId': 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  'protocolId': 'MQTT',
  'username': env.MQTT_USERNAME,
  'password': env.MQTT_PASSWORD
}

let dataMap: DataMapInterface[] = [];

/* Connect MQTT-Client to Databus (MQTT-Broker) */
var client = connect('mqtt://' + env.MQTT_HOST, options);

/* Subscribe to Topic after connection is established */
client.on('connect', () => {
  console.log('Connected to ' + env.MQTT_HOST);
  client.subscribe(mqttDataTopic, () => {
    console.log('Data-Collector: MQTT: Subscribed to ' + mqttDataTopic);
  });
});

/* Write Data to InfluxDB after recieved message*/
client.on('message', function (topic, message) {
  let msg = JSON.parse(message.toString());
  console.log(`Data-Collector: MQTT: Recieved message ${msg} on MQTT-Topic ${topic} responding with corresponding answer`)
  // write msg to influx
  if (topic === env.MQTT_DEFAULT_TOPICNAME) {
    let res = getDataSource(msg)
    console.log(res)
    if(res){
        dataMap = res;
        res.forEach(x => {
          if(env.MQTT_DATASOURCES.includes(x.connectionName)){
              client.subscribe(x.topic);
          }
        })
    }
    console.log(dataMap);
  }
  else {
    var jsonmsg = JSON.parse(msg);
    jsonmsg.vals.forEach((element: { id: string; val: any; ts:string; }) => {
      let nameIDMap = dataMap.find(x => x.topic === topic.toString()).values.find(y => y.value === element.id);
      console.log(nameIDMap,"dsfsdfsdsdf",element)
      const mutationGql = gql `
              mutation CreateData($createDataArgs: DataContent!) {
                createData(args: $createDataArgs)
              }
            `
      apolloClient.mutate({mutation:mutationGql,variables:{createDataArgs : {name:nameIDMap.name,val:element.val,ts:element.ts}}}).then().catch((e) => console.log(JSON.stringify(e)));      
    })
  }
});