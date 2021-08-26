export interface NameIdMapInterface {
    name:string;
    value:string;
  }
  
  
export interface DataMapInterface {
    connectionName?: string
    topic?:string;
    values?:NameIdMapInterface[];
}

const getDataSource = (msgString: any) => {
    
    let connectionMap: DataMapInterface[] = []; 
    let msg = JSON.parse(msgString);
    console.log(typeof(msg))
    if (msg === undefined  || msg.seq === undefined || msg.connections === undefined) {
        return null;
    } 

    msg.connections.forEach((connection: { name: any; dataPoints: any; }) => 
    {
        let nameIDMap:NameIdMapInterface[] = [];
        let dataPoints = connection.dataPoints;
        let topicName:string;
        //  Iterate through dataPoints
        dataPoints.forEach( (dataPoint: { dataPointDefinitions: any; name: any; topic: any; }) => {
            let dataPointDefinitions = dataPoint.dataPointDefinitions;
            topicName = dataPoint.topic;
            // Iterate through dataPointDefinitions
            dataPointDefinitions.forEach((dataPointDefinition: { name: any; id: any; }) => {
                nameIDMap.push({name:dataPointDefinition.name, value:dataPointDefinition.id} as NameIdMapInterface);
            });
        });
        connectionMap.push({connectionName:connection.name,topic:topicName,values:nameIDMap} as DataMapInterface)
    });

    return connectionMap;

}


export  { getDataSource };