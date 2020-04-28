import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import UserReducer from './reducers/Reducer_User';

const rootReducer = combineReducers({
    User: UserReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
