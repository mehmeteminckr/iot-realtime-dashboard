import React, { useState } from 'react';
import { addNewWidget,  StateInterface,  WidgetInterface , addNewDashboard, DashboardInterface} from './redux/reducers'
import { useDispatch, useSelector } from 'react-redux';


const NewDashboard = () => {

    const dashboardId = useSelector((state: StateInterface) => state.selectedDashboard);
    const [dashboardInput,setDashboardInput] = useState("{}" as string)

    //console.log(widgets)

    const dispatch = useDispatch();


    return (
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">New Dashboard</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <span>Title</span>
                        <input onChange= {(e) => setDashboardInput(e.currentTarget.value)} type="text" className="form-control" id="formGroupExampleInput" placeholder=""/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button onClick={() => dispatch(addNewDashboard(dashboardInput))} type="button" className="btn btn-primary">Create</button>
                    </div>
                </div>
            </div>
    );
};


export default NewDashboard;