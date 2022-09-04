import axios from 'axios';
import { SIGN_IN, SIGN_OUT, BASE_API_URL } from '../utils/constants';
import { initiateGetProfile } from './profile';
import { resetAccount } from './account';
import { history } from '../router/AppRouter';
import { getErrors } from './errors';
import { post } from '../utils/api';

export const signIn = (user) => ({
    type: SIGN_IN,
    user
});

export const initiateLogin = (email, password) => {
    return async (dispatch) => {
        try {
            const result = await axios.post(`${BASE_API_URL}/signin`, {
                email,
                password
            });
            const user = result.data;
            localStorage.setItem('user_token', user.token);
            dispatch(signIn(user));
            // this next line adds profile data to the redux store
            // (so that we cannot access login or register pages once already logged in)
            dispatch(initiateGetProfile(user.email));
            history.push('/profile');
        } catch (error) {
            error.response && dispatch(getErrors(error.response.data));
        }
    };
};

// In this function we call the API on port 5000
// by passing the user data as the second parameter to it and sending back object {success: true } 
// as a result of API for successful and {success: false} for failure
export const registerNewUser = (data) => {
    return async (dispatch) => {
        try {
            await axios.post(`${BASE_API_URL}/signup`, data);
            return { success: true };
        } catch (error) {
            error.response && dispatch(getErrors(error.response.data));
            return { success: false };
        }
    };
};

export const signOut = () => ({
    type: SIGN_OUT
});

export const initiateLogout = () => {
    return async (dispatch) => {
        try {
            await post(`${BASE_API_URL}/logout`, true, true);
            localStorage.removeItem('user_token');
            dispatch(resetAccount());
            return dispatch(signOut());
        } catch (error) {
            error.response && dispatch(getErrors(error.response.data));
        }
    };
};