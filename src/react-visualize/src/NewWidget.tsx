import React, { useState } from 'react';
import { addNewWidget, StateInterface,  WidgetInterface} from './redux/reducers'
import { useDispatch, useSelector } from 'react-redux';
import CheckIcon from '@material-ui/icons/Check';
import InfluxDBClient from './mqtt/apollo-client';


const NewWidget = () => {
    const refreshInterval = [1,5,10,15];
    const dashboardId = useSelector((state: StateInterface) => state.selectedDashboard);
    const measurements = useSelector((state: StateInterface) => state.measurements);
    const widgetsLenght = useSelector((state: StateInterface) => state.dashboards.find(x => x.id === dashboardId)?.widgets)?.length;
    let id = widgetsLenght as number + 1;
    const [widgetInput,setWidgetInput] = useState({width:350,id:id,height:350,x:150,y:150 ,refreshValue:0,values:[] as any[]} as WidgetInterface)

    const dispatch = useDispatch();

    const addValue = (selectedValue:string,values:string[]) => {
        if(values.includes(selectedValue)){
            values = values.filter(x => x !== selectedValue);
            setWidgetInput({...widgetInput,values:values});
        }
        else {
            let newValues = [...values,selectedValue]
            setWidgetInput({...widgetInput,values:newValues});
        }
    }

    const createWidget = (dashboardId:number,widgetInput:WidgetInterface) => {
        setWidgetInput({...widgetInput,id:widgetInput.id + 1});
        dispatch(addNewWidget({widget:widgetInput,dashboardId:dashboardId}));
    }

    return (
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">New Widget</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <span>Title</span>
                        <input onChange= {(e) => setWidgetInput({...widgetInput,title:e.currentTarget.value})} type="text" className="form-control" id="formGroupExampleInput" placeholder=""/>
                        <br></br>
                        <span>Category</span>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            { widgetInput.category ? widgetInput.category : "Choose Category"}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a onClick= {(e) => setWidgetInput({...widgetInput,category:"Line Chart"})} className="dropdown-item" href="#">Line Chart</a>
                                <a onClick= {(e) => setWidgetInput({...widgetInput,category:"Pie Chart"})} className="dropdown-item" href="#">Pie Chart</a>
                                <a onClick= {(e) => setWidgetInput({...widgetInput,category:"Timeseries Chart"})} className="dropdown-item" href="#">Timeseries Chart</a>
                            </div>
                        </div>
                        <br></br>
                        <span>Values</span>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            { widgetInput.values!.length > 0 ? widgetInput.values!.length : "Choose Values"}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                { 
                                
                                measurements.map(x => (
                                        <a onClick = {() => addValue(x, widgetInput.values!)} className="dropdown-item" href="#">{
                                            x  } {widgetInput.values!.includes(x) ? <CheckIcon color={'secondary'}></CheckIcon>:null}</a>
                                    ))
                                }
                               
                            </div>
                        </div>
                        <br></br>
                        <span>Refresh Value</span>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            { widgetInput.refreshValue !== 0 ? widgetInput.refreshValue : "Choose Value"}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                { 
                                
                                refreshInterval.map(x => (
                                        <a onClick = {() => setWidgetInput({...widgetInput,refreshValue:x})} className="dropdown-item" href="#">{
                                            x} {widgetInput.refreshValue === x ? <CheckIcon color={'secondary'}></CheckIcon>:null}</a>
                                    ))
                                }
                               
                            </div>
                        </div>
                        <br></br>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button onClick={() => createWidget(dashboardId,widgetInput)} type="button" className="btn btn-primary">Create</button>
                    </div>
                </div>
            </div>
    );
};


export default NewWidget;