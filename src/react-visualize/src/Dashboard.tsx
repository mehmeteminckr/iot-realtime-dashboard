import {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { updateWidget, ChartType, StateInterface, deleteWidget } from './redux/reducers';
import { Rnd } from 'react-rnd';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';
import { LineChart } from './widgets/LineChart';
import { ApolloClient, HttpLink, InMemoryCache , gql, useSubscription} from '@apollo/client';
import fetch from 'cross-fetch';
import { WebSocketLink } from 'apollo-link-ws';
import apolloClient from './mqtt/apollo-client';



const Dashboard = () => {


    const dashboardId = useSelector((state: StateInterface) => state.selectedDashboard);
    const dashboard = useSelector((state: StateInterface) => state.dashboards.find(x => x.id === dashboardId));

    const dispatch = useDispatch();

    const series = useSelector((state:StateInterface) => state.series);

    const editMode = useSelector((state: StateInterface) => state.editMode);

      
    console.log('start subscription to sensor');
    const subscriptionGql = gql `
          subscription($subscribe2DataTopic: [String]!) {
            subscribe2data(topic: $subscribe2DataTopic) {
              name
              val
              ts
            }
          }
        `
    const { data , loading } = useSubscription(subscriptionGql,
        {variables:{subscribe2DataTopic:series?.map(x => x.name)}, client:apolloClient,})
    console.log(data)
    

    return (
        <div className="container">
            
                {
                  dashboard?.widgets.map((widget) => {
            
                    if(widget.category === 'Line Chart'){
                      
                    }
      
                    return (
                        <Rnd
                            size={{ width: widget.width,  height: widget.height }}
                            position={{ x: widget.x, y: widget.y }}
                            onDragStop={(e, d) => { dispatch(updateWidget({dashboardId:dashboardId,widgetId:widget.id, param:"X", value:d.x})) 
                                                    dispatch(updateWidget({dashboardId:dashboardId,widgetId:widget.id, param:"Y", value:d.y}))
                                                  }}
                            onResizeStop={(e, direction, ref, delta, position) => {
                                dispatch(updateWidget({dashboardId:dashboardId,widgetId:widget.id, param:"width", value:ref.style.width}))
                                dispatch(updateWidget({dashboardId:dashboardId,widgetId:widget.id, param:"height", value:ref.style.height}))
                            }}
                            disableDragging={!editMode}
                            enableResizing={editMode}
                            > 
                              <div className="d-flex">
                                <LineChart data={data?.subscribe2data} width={widget.width} height={widget.height}/>
                                { editMode &&
                                <IconButton onClick={() => dispatch(deleteWidget({widgetId:widget.id,dashboardId:dashboardId}))} className="deleteButton btn btn-secondary btn-sm"><DeleteIcon className="deleteIcon" /></IconButton>
                                }
                                </div>
                        </Rnd>)
                  })
                }
        </div>

    );
};


export default Dashboard;