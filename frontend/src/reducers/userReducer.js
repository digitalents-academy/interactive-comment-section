import { createSlice } from '@reduxjs/toolkit';
import { setNoti } from './notiReducer';
import { sha256str } from '../../../common_lib/util.js';

const initial = { user: '', pfp: null };

const userSlice = createSlice({  
    name: 'user', initialState: {...initial}, reducers: {
        setUser(state, action) {
            return {...action.payload};
        },
        
        doLogin(state, action) {         
            const obj = action.payload;
            localStorage.setItem('pfp', obj.user.png); localStorage.setItem('user', obj.user.name);   
            return {user: obj.user.name, pfp: obj.user.png};
        },

        resetUser() {
            return initial;
        }
    }
});

export const { setUser, doLogin, resetUser } = userSlice.actions;

export const login = (user, pw) => {  
    return async dispatch => {
        try {
            const res = await fetch('https://localhost:8443/api/user/login', {
                method: 'POST',
                body: JSON.stringify({name: user, pwhash: await sha256str(pw)}), 
                headers: { "Content-Type": "application/json" },
            });
            const result = await res.json();
            if (!result.success) { throw result.error; }
            dispatch(doLogin(result));
            dispatch(setNoti(`logged in as '${result.user.name}'`));
        }

        catch(e) {
            console.log(e);
            dispatch(setNoti(String(e)));
        }
        
    }
};

export const register = (user, pwd, pfp) => {
    return async dispatch => {
        const fd = new FormData();
        fd.append('png', pfp); fd.append('pwhash', await sha256str(pwd)); fd.append('name', user);
        try {
            const res = await fetch('https://localhost:8443/api/user/new', {
                method: 'POST',
                body: fd
            });
            const result = await res.json();
            if (!result.success) { throw result.error; }

            dispatch(doLogin(result));
            dispatch(setNoti(`registered and logged in as '${result.user.name}'`));
        }
        
        catch(e) {
            console.log(e);
            dispatch(setNoti(String(e)));
        }
    }
};

export const logOff = () => {
    return async dispatch => {
        try {
            const res = await fetch('https://localhost:8443/api/user/logout', { method: 'GET' });
            console.log(res);
        }
        catch(e) {
            console.log(e);
            dispatch(setNoti(String(e)));
        }
        localStorage.clear();
        dispatch(resetUser());
        dispatch(setNoti('bye'));
    }
}

export default userSlice.reducer;