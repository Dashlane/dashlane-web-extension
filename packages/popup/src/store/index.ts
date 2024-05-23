import { createStore } from 'redux';
import AppReducer from './reducers/app';
const store = createStore(AppReducer.apply);
export default store;
