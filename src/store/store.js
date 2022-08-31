// this is a redux store with a single authentication reducer

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    combineReducers({
        auth: authReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
);

export default store;