import Dashboard from './Dashboard';
import NewWidget from './NewWidget';
import { Button } from 'react-bootstrap';
import "./HomePage.css";
import { StateInterface ,updateEditMode , setCurrentDashboard ,deleteDashboard } from './redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import NewDashboard from './NewDashboard';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';

const HomePage = () => {

    const editMode = useSelector((state: StateInterface) => state.editMode);
    const dashboards = useSelector((state: StateInterface) => state.dashboards);
    const selectedDashboard = useSelector((state: StateInterface) => state.selectedDashboard);
    const dispatch = useDispatch();

    return (
        <div className = "mainrow row m-0 "> 
            <div className = "header row m-0 bg-dark justify-content-center ">
                <h1 className="text-white">Insight</h1>
            </div>
            <div className = "content row vw-100 m-0 ">
            <div className="sidebar col-4 col-sm-auto pt-2 border-right border-secondary">
                <div className="d nav flex-column nav-pills " id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <a className="sidebar-tabs-top text-white px-4 text-center text-dark nav-link" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-profile" aria-selected="true">Home</a>
                    <a className="sidebar-tabs px-4 text-center text-dark nav-link" id="v-pills-profile-tab" data-toggle="modal" data-target="#createDashboard" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="true">Create Dashboard</a>
                    {selectedDashboard !== 0 && <a className="sidebar-tabs px-4 text-center text-dark nav-link" id="v-pills-profile-tab" data-toggle="modal" data-target="#createWidget" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="true">Create Widget</a> }
                    <a className="sidebar-tabs px-4 text-center text-dark nav-link" id="v-pills-profile-tab" data-toggle="modal" role="tab" aria-controls="v-pills-profile" aria-selected="true"><Button className= {editMode ? "editButton btn btn-success" : "editButton" } onClick={() => dispatch(updateEditMode())}>Edit Mode</Button></a>
                </div>
            </div>
            <div className= { editMode ? "col-8 col-sm bg-light p-0 border border-primary border-dotted"
                                       : "col-8 col-sm bg-light p-0" }
            >
                <div className="tab-content" id="v-pills-tabContent">
                    <div className = "dashboardTab">
                    {
                        dashboards.map(x => 
                            <>
                            {
                              editMode && <IconButton onClick={() => dispatch(deleteDashboard(x.id))} ><DeleteIcon/> </IconButton>
                            }
                            <Button  className= { selectedDashboard === x.id ? "dashboardButton btn btn-info m-2 p-2 active" 
                                                                             : "dashboardButton btn btn-info m-2 p-2"
                                                                        } 
                                    onClick = {() => dispatch(setCurrentDashboard(x.id))}>{x.title}</Button>
                            </>
                        )
                    }
                    </div>
                    <div className="tab-pane fade show active bg-dark" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                        {dashboards.length !== 0 && <Dashboard/>}
                    </div>
                    <div className="modal fade" id="createDashboard" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> <NewDashboard/></div>
                    <div className="modal fade" id="createWidget" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        {selectedDashboard !== 0 && <NewWidget/>}
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
};


export default HomePage;