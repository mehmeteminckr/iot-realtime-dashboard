import config from "../config/env-config.json";
import {InfluxDB , FieldType, Measurement} from 'influx';

export interface res {
  time: Date;
  value: number;
}



export default class  InfluxDBClient {

    private influx: InfluxDB | undefined;
    private static instance: InfluxDBClient;

    private constructor(){
      this.influx = new InfluxDB({
        host: config.HOST,
        database: config.DATABASE,
        port: Number(config.PORT),
        username: config.USERNAME,
        password: config.PASSWORD,
        schema: [
          {
            measurement: "uihqiuwhe",
            fields: {
              value: FieldType.FLOAT
            },
            tags: [
              'host'
            ]
          }
        ]
      })
    }
    static getInstance() {
      if(!InfluxDBClient.instance){
        InfluxDBClient.instance = new InfluxDBClient();
      }
      return InfluxDBClient.instance;
    }

    getMetaData(){
        return this.influx!.getMeasurements(config.DATABASE).then(x => {
        console.log(x)
        return x;
      })
    }

    getMeasurement(msrmt:String){
      return new Promise((resolve,reject) => {
        let influxQL="select * from \""+msrmt+"\"";
        this.influx!.query(influxQL)
            .then((res : any) => {
            console.log(res[0]);
            console.log(new Date(res[0].time).getTime());
            let data = res.filter((x: { time: Date; value: number; }) => x.time != undefined && x.value != undefined)
                    .map((y: { time: string | number | Date; value: any; }) => [new Date(y.time).getTime(),y.value]);

            console.log(data,"asdasdasds")
            resolve(data);
            });
      });
    }
    postMeasurement({name,val,ts}){
        this.influx.writePoints([
            {
              measurement: name,
              fields: { value: Number(val) },
              timestamp:new Date(ts).getTime()
            }
          ])
          .catch(error => {
            console.error(`Data-Collector: Error saving data to InfluxDB! ${error.stack}`)
          })
    }
}

    



