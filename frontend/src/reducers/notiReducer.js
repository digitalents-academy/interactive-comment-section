import { createSlice } from '@reduxjs/toolkit';

const notiSlice = createSlice({  
    name: 'notification', initialState: { current: '', thing: false }, reducers: {    
        setNoti(state, action) {
            return { current: action.payload, thing: !state.thing };   
        },
        clearNoti(state) {
            return { current: '', thing: !state.thing};
        }
    }
})

export const { setNoti, clearNoti } = notiSlice.actions;
export default notiSlice.reducer;