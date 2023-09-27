import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const login = createAsyncThunk('user/login', async() => {
    try {

    } catch (error) {
        return error;
    }
})

export const register = createAsyncThunk('user/register', async() => {
    try {

    } catch (error) {
        return error;
    }
})

export const logout = createAsyncThunk('user/logout', async() => {
    try {

    } catch (error) {
        return error;
    }
})

export const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                return (state = {
                    ...state,
                    ...action.payload
                });
            })
            .addCase(register.fulfilled, (state, action) => {
                return (state = {
                    ...state,
                    ...action.payload
                });
            })
            .addCase(logout.fulfilled, (state, action) => {
                return (state = {
                    ...state,
                    ...action.payload
                });
            })
    }
})