import { createSlice } from '@reduxjs/toolkit';

const notiSlice = createSlice({  
    name: 'notification', initialState: '',  reducers: {    
        setNoti(_state, action) {
            return action.payload;    
        },
        clearNoti() {
            return '';
        }
    }
})

export const { setNoti, clearNoti } = notiSlice.actions;
export default notiSlice.reducer;