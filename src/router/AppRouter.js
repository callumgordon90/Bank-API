import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createBrowserHistory } from 'history';
import { Route, Switch, Router } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import Profile from '../components/Profile';
import Header from '../components/Header';
import Logout from '../components/Logout';
import Account from '../components/Account';

// The hisory function allows us to redirect to profile page after login
export const history = createBrowserHistory();

//This is the router which unites all of the other components of the front end application
const AppRouter = ({ auth }) => {
    return (
        <Router history={history}>
            <div>
                {!_.isEmpty(auth.token) && <Header />}
                <div className="container">
                    <Switch>
                        <Route path="/" component={Login} exact={true} />
                        <Route path="/register" component={Register} />
                        <Route path="/account" component={Account} />
                        <Route path="/profile" component={Profile} />
                        <Route path="/logout" component={Logout} />
                    </Switch>
                </div>
            </div>
        </Router>
    );
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(AppRouter);