import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import HomeScreenReducer from './reducers/Reducer_HomeScreen';

const rootReducer = combineReducers({
    HomeScreen: HomeScreenReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
