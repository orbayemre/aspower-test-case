import {createSlice} from "@reduxjs/toolkit";
import useAuthStoreInitial from "../hooks/useAuthStoreInitial";
import Cookies from 'js-cookie';

export const authData = createSlice({
    name:'auth',
    initialState: await useAuthStoreInitial(),    /* initialState:{ isLogin: false, accessToken: "", rıke:"", data:null }, */
    reducers:{
        setLogin: (state, action) => {
            Cookies.set('token', action.payload.data.token);
            Cookies.set('role', action.payload.role);
            
            state.isLogin = true;
            state.accessToken = action.payload.data.token;
            state.role = action.payload.role;
            state.data = action.payload.data.data;
        },
        setLogout: (state) => {
            Cookies.remove('token');
            Cookies.remove('role');
            
            state.isLogin = false;
            state.accessToken = "";
            state.role = "";
            state.data = null;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setAuthData: (state, action) => {
            state.data = action.payload;
        },
        setRole: (state, action) => {
            state.role = action.payload;
        },
    }
})

export const {setLogin, setLogout, setAccessToken, setAuthData, setRole} = authData.actions;

export default authData.reducer;
