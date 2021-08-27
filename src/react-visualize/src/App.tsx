import { useDispatch, useSelector } from 'react-redux';
import HomePage from './HomePage';
import './HomePage.css'
import InfluxDBClient from './graphql-client/apollo-client';
import { addMeasurements, StateInterface } from './redux/reducers';
import apolloClient from './graphql-client/apollo-client';
import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';


function App() {
  const msrmnts = useSelector((state: StateInterface) => state.measurements);

  const dispatch = useDispatch();

  const queryGql = gql `
      query {
        measurements
      }
  `
  const { data , loading } = useQuery(queryGql,{variables:{}, client:apolloClient.instance, skip: (msrmnts.length > 0 ? true: false) })
  if(data){
    console.log(data)
    dispatch(addMeasurements(data.measurements))
  }

  return (
    <div className="app">
        <HomePage />
    </div>
    
  );
}

export default App;
