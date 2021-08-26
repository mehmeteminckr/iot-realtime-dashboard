import { configureStore } from '@reduxjs/toolkit'

import todoSlice from './reducers';


export default configureStore({
  reducer: todoSlice
});