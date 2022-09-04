import axios from 'axios';
import { setAuthHeader, removeAuthHeader } from './common';


// In this file the following parameters are sent to every get, post and patch route:
// API URL 
// Data to send to API 
// the Authorization header before making API call (if needed), send true 
// the removal of the auth header after making API call (if needed), send true


export const get = async (
    url,
    params,
    shouldSetAuthHeader = true,
    shouldRemoveAuthHeader = false
) => {
    if (shouldSetAuthHeader) {
        setAuthHeader();
    }
    const result = await axios.get(url, params);
    if (shouldRemoveAuthHeader) {
        removeAuthHeader();
    }
    return result;
};

export const post = async (
    url,
    params,
    shouldSetAuthHeader = true,
    shouldRemoveAuthHeader = false
) => {
    if (shouldSetAuthHeader) {
        setAuthHeader();
    }
    const result = await axios.post(url, params);
    if (shouldRemoveAuthHeader) {
        removeAuthHeader();
    }
    return result;
};

export const patch = async (
    url,
    params,
    shouldSetAuthHeader = true,
    shouldRemoveAuthHeader = false
) => {
    if (shouldSetAuthHeader) {
        setAuthHeader();
    }
    const result = await axios.patch(url, params);
    if (shouldRemoveAuthHeader) {
        removeAuthHeader();
    }
    return result;
};