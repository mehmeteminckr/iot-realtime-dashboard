import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ChartType } from "../redux/reducers";


interface PieChartUpdateInteface {
    data: {name:string,val:number,ts:number};
    width:number;
    height:number;
    selectedValues:string[];
}

export const PieChart = (props :PieChartUpdateInteface) => {

    const [values,setValues] = useState([] as any[]);

    pieChartOptions.labels = props.selectedValues

    useEffect(() => {

        const UpdateValues = (newValues : PieChartUpdateInteface)=> {
            
          console.log(newValues,"sdsdf",pieChartOptions.labels)
          let labelIndex = pieChartOptions.labels.findIndex(x => x === newValues.data.name);
          console.log(labelIndex)
          let newArrayValues = [...values];
          newArrayValues[labelIndex] = newValues.data.val;
          console.log(newArrayValues);
          setValues(newArrayValues);

        }

        if (props.data && props.selectedValues.some(x => x === props.data.name)) {
          UpdateValues(props);
        }
    
      }, [props.data]);

    console.log("dddddddd",values,props.data)
    return(
        <div>
             <ReactApexChart options={pieChartOptions} series={values} type={pieChartOptions.chart.type} height={props.height} width={props.width} />
        </div>
        
    )
}




let pieChartOptions = {
    chart: {
      width: 380,
      type: 'donut' as ChartType,
    },
    labels:[] as string[]
    ,
    dataLabels: {
      enabled: true
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          show: true
        }
      }
    }],
    legend: {
      position: 'right' as 'right',
      offsetY: 0,
      height: 230,
    }
  }
