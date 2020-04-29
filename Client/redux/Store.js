import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import UserReducer from './reducers/Reducer_User';
import CustomerReducer from './reducers/Reducer_Customer';
import BusinessReducer from './reducers/Reducer_Business';

const rootReducer = combineReducers({
    User: UserReducer,
    Customer: CustomerReducer,
    Business: BusinessReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
