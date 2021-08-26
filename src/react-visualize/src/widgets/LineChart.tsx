import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ChartType } from "../redux/reducers";


interface LineChartUpdateInteface {
    data: {name:string,val:number,ts:number};
    width:number;
    height:number
}

export const LineChart = (props :LineChartUpdateInteface) => {

    const [values,setValues] = useState([] as any[]);

    useEffect(() => {

        const UpdateValues = (newValues : LineChartUpdateInteface)=> {
            
          console.log(newValues,"sdsdf",values)
          let updatedValues = Array.from(values);
          if(newValues.data && newValues.data.name && newValues.data.val){
            let index = updatedValues.findIndex(x => x.name === newValues.data.name)
            if(index === -1) {
                updatedValues.push({name:newValues.data.name,data:[[Number(newValues.data.ts),newValues.data.val]]})
                console.log(newValues)
            }
            else {
                updatedValues = updatedValues.map((x,i) => {
                    if(i === index){
                        return {
                            name: x.name,
                            data: [...x.data,[Number(newValues.data.ts),newValues.data.val]]
                        }
                    }
                    return x;
                })
                
            }
          }
      
          setValues(updatedValues);
        }
        if (props) {
          UpdateValues(props);
        }
    
      }, [props.data]);

    return(
        <div>
             <ReactApexChart options={lineChartOptions} series={values} type={lineChartOptions.chart.type} height={props.height} width={props.width} />
        </div>
        
    )
}




let lineChartOptions ={
    chart: {
      type: 'area' as ChartType,
      stacked: false,
      zoom: {
        type: 'x' as 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom' as 'zoom'
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    title: {
      text: "widget.title",
      align: 'left' as 'left'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      },
    },
    yaxis: {
      labels: {
        formatter: function (val: number) {
          return (val / 1).toFixed(5);
        },
      },
      title: {
        text: 'Value'
      },
    },
    xaxis: {
      type: 'datetime' as 'datetime',
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val: number) {
          return (val / 1).toFixed(5)
        }
      }
    }
  }