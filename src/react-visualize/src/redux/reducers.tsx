import { createSlice } from '@reduxjs/toolkit'
import InfluxDBClient from '../graphql-client/apollo-client';


export type ChartType = "area" | "line" | "bar" | "histogram" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "treemap" | "boxPlot" | "candlestick" | "radar" | "polarArea" | "rangeBar" | undefined


export interface SerieDataInterface {
  name:string;
  counter:number;
}

export interface WidgetInterface {
  id: number;
  title: string;
  category: string;
  values?:string[];
  data:any[];
  width:number;
  height:number;
  x:number;
  y:number;
}

export interface DashboardInterface {
  id: number
  title:string
  widgets: WidgetInterface[]
}


export interface StateInterface {
  dashboards :DashboardInterface[],
  selectedDashboard: number,
  series?: SerieDataInterface[];
  measurements : string[],
  editMode: boolean
}

const initialState : StateInterface = {
   dashboards: [],
   measurements: [] ,
   selectedDashboard:0,
   editMode: false,
   series:[]
  };

export const todoSlice = createSlice({
  name: 'widgets',
  initialState: initialState,
  reducers: {
    addNewDashboard: (state,action) => {
      let lenght: number = state.dashboards.length;
      let dashboard: DashboardInterface = {id:lenght+1,title:action.payload,widgets:[] as WidgetInterface[]}
      state.dashboards.push(dashboard);
    },
    addNewWidget: (state : StateInterface, action) => {
      let widgetPayload:WidgetInterface = action.payload.widget;
      let dashboardIndex = state.dashboards.findIndex(x => x.id === action.payload.dashboardId)
      state.dashboards[dashboardIndex].widgets.push(widgetPayload as WidgetInterface);
      widgetPayload.values?.forEach((d : string) => {
        let serie  =state.series?.findIndex(s => s.name === d)
        if(serie !== -1){
          state.series![serie as number].counter = state.series![serie as number].counter + 1;
        }
        else {
            state.series?.push({name:d,data:[],counter:1} as SerieDataInterface)
        }
      })
    },
    addMeasurements: (state: StateInterface, action) => {
      console.log(action.payload)
      state.measurements = action.payload
    },
    deleteDashboard: (state: StateInterface, action) => {
      state.dashboards = state.dashboards.filter(x => x.id !== action.payload);
      if(state.selectedDashboard == action.payload) {
        state.selectedDashboard = 0
      }
    },
    deleteWidget: (state,action) => {
      let dashboardIndex = state.dashboards.findIndex(x => x.id === action.payload.dashboardId)
      let widgetId = action.payload.widgetId;
      let widget = state.dashboards[dashboardIndex].widgets.find(x => x.id === widgetId);
      state.dashboards[dashboardIndex].widgets = state.dashboards[dashboardIndex].widgets.filter(x => x.id !== widgetId);
      widget?.values?.forEach(x => {
        let serieIndex  = state.series?.findIndex(s => s.name === x);
        let counter = state.series![serieIndex as number].counter;
        if(counter === 1) {
          state.series = state.series?.filter(y => y.name !== x);
        }
        else {
        state.series![serieIndex as number].counter = counter -1;
        }
      })
    },
    updateWidget: (state,action) => {
      let dashboardIndex = state.dashboards.findIndex(x => x.id === action.payload.dashboardId)
      let widgetId = action.payload.widgetId;
      let widget = state.dashboards[dashboardIndex].widgets.findIndex(x => x.id === widgetId);
      console.log(widget,"ssss",action);
      if(action.payload.param === "X" && widget !== undefined){
        state.dashboards[dashboardIndex].widgets[widget].x = action.payload.value
      }
      if(action.payload.param === "Y" && widget !== undefined){
        state.dashboards[dashboardIndex].widgets[widget].y = action.payload.value
      }
      if(action.payload.param === "width" && widget !== undefined){
        state.dashboards[dashboardIndex].widgets[widget].width = action.payload.value
      }
      if(action.payload.param === "height" && widget !== undefined){
        state.dashboards[dashboardIndex].widgets[widget].height = action.payload.value
      }
      if(action.payload.param === "data" && widget !== undefined){
        if(state.dashboards[dashboardIndex].widgets[widget].data.length === 0) {
          state.dashboards[dashboardIndex].widgets[widget].data.push({name:action.payload.name,data:[action.payload.data]})
        }
        else{
          state.dashboards[dashboardIndex].widgets[widget].data = state.dashboards[dashboardIndex].widgets[widget].data.map(x => {
          if(x.name === action.payload.name){

            return [...x.data,action.payload.data];
          }
          return x;
        })
        }
      }

    },
    updateEditMode: (state) => {
      state.editMode = !state.editMode
    },
    setCurrentDashboard: (state,action) => {
      state.selectedDashboard = action.payload
    },
  }
})

// Action creators are generated for each case reducer function
export const { 
    addNewWidget, deleteWidget ,updateWidget ,updateEditMode ,
    setCurrentDashboard, addNewDashboard , deleteDashboard ,
    addMeasurements
  } = todoSlice.actions

export default todoSlice.reducer