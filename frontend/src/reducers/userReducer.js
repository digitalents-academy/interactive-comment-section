import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as util from '../../../common_lib/util.js'

export const signin = createAsyncThunk('user/login', async({user, pwd}) => {
    try {
        const hash = await util.sha256str(pwd);
        const obj = { name: user, pwhash: hash };
        const res = await fetch('https://localhost:8443/api/user/login', {
            method: 'POST',
            body: JSON.stringify(obj), 
            headers: { "Content-Type": "application/json" }            
        });
        const result = await res.json();
        console.log(result)
        return result;
    } catch (error) {
        return error;
    }
});

export const signup = createAsyncThunk('user/register', async(formData) => {
    try {
        const res = await fetch('https://localhost:8443/api/user/new', {
            method: 'POST',
            body: formData
        });
        const result = await res.json();
        return result;
    } catch (error) {
        return error;
    }
});

export const signout = createAsyncThunk('user/logout', async() => {
    try {

    } catch (error) {
        return error;
    }
});

export const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signin.fulfilled, (state, action) => {
                return (state = {
                    ...state,
                    ...action.payload
                });
            })
            .addCase(signin.rejected, (state, action) => {
                return (state = {
                    ...state,
                    error: action.payload
                });
            })
            .addCase(signup.fulfilled, (state, action) => {
                return (state = {
                    ...state,
                    ...action.payload
                });
            })
            .addCase(signout.fulfilled, (state, action) => {
                return (state = {
                    ...state,
                    ...action.payload
                });
            })
    }
});

export default userSlice.reducer;