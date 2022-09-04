// This is the redux store which contains all of the reducers used on the front end application
//I have also added redux dev tool to see realtime actions dispatched.

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import errorsReducer from '../reducers/errors';
import profileReducer from '../reducers/profile';
import transactionsReducer from '../reducers/transactions';
import accountReducer from '../reducers/account';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    combineReducers({
        auth: authReducer,
        errors: errorsReducer,
        profile: profileReducer,
        transactions: transactionsReducer,
        account: accountReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
);

export default store;