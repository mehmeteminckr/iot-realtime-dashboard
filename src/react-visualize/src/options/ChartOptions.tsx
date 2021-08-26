import moment from "moment";
import { ChartType } from "../redux/reducers";



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



let pieChartOptions = {
    chart: {
      width: 380,
      type: 'donut' as ChartType,
    },
    labels:[]
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

  let timelineChartOptions = {
    chart: {
      height: 450,
      type: 'rangeBar' as ChartType
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%'
      }
    },
    xaxis: {
      type: 'datetime' as 'datetime'
    },
    stroke: {
      width: 1
    },
    fill: {
      type: 'solid',
      opacity: 0.6
    },
    legend: {
      position: 'top' as 'top',
      horizontalAlign: 'left' as 'left'
    }
  }



  export  { timelineChartOptions,lineChartOptions, pieChartOptions};
