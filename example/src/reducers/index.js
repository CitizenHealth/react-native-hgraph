import { combineReducers } from 'redux';
import DataReducer from './DataReducer';

export default combineReducers({
    data: DataReducer
})