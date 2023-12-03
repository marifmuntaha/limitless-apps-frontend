import axios from "axios";
import HandleError from "../pages/auth/handleError";
import {toastSuccess} from "../components";
import handleError from "../pages/auth/handleError";
export const AuthLogin = async (url, state) => {
    state.setLoading && state.setLoading(true);
    return await axios.post(url, state.formData).then(resp => {
        state.setLoading && state.setLoading(false);
        return resp;
    }).catch(error => {
        HandleError(error);
        state.setLoading && state.setLoading(false);
    })
}
export const AuthInfo = async (url, state) => {
    return await axios.get(url).then(resp => {
        state.setData(resp.data.result);
        state.setAuth(true);
    }).catch(error => {
        HandleError(error);
        state.setAuth(false);
    })
}

export const getData = async (url, state, params) => {
    return await axios.get(url, {
        params: params
    }).then(resp => {
        state.setData && state.setData(resp.data.result);
        return resp.data.result;
    }).catch(error => HandleError(error));
}

export const storeData = async (url, state) => {
    state.setLoading && state.setLoading(true);
    return await axios.post(url, state.formData).then(resp => {
        toastSuccess(resp.data.message);
        state.setLoading && state.setLoading(false);
        state.toggle && state.toggle();
        state.setReload && state.setReload(true);
        return resp.data.result;
    }).catch(error => {
        handleError(error);
        state.setLoading && state.setLoading(false);
    })
}
export const updateData = async (url, state) => {
    state.setLoading && state.setLoading(true);
    axios.put(url, state.formData).then(resp => {
        toastSuccess(resp.data.message);
        state.setLoading && state.setLoading(false);
        state.toggle && state.toggle();
        state.setReload && state.setReload(true);
    }).catch(error => {
        handleError(error);
        state.setLoading && state.setLoading(false);
    })
}
export const deleteData =  async (url, state) => {
    state.setLoading && state.setLoading(state.id);
    await axios.delete(url).then(resp => {
        toastSuccess(resp.data.message);
        state.setLoading && state.setLoading(0);
        state.setReload && state.setReload(true);
    }).catch(error => {
        handleError(error);
        state.setLoading && state.setLoading(0);
    })
}

export const notifyData =  async (url, state) => {
    state.setLoading && state.setLoading(state.id);
    await axios.post(url).then(resp => {
        toastSuccess(resp.data.message);
        state.setLoading && state.setLoading(0);
    }).catch(error => {
        handleError(error);
        state.setLoading && state.setLoading(0);
    })
}