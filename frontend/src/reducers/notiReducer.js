import { createSlice } from '@reduxjs/toolkit';

const initial = { msg: '', thing: false, type: '' }
const notiSlice = createSlice({  
    name: 'notification', initialState: initial, reducers: {    
        setNoti(state, action) {
            const input = action.payload;
            if (typeof input === 'string') return { msg: input, thing: !state.thing, type: '' };
            if (typeof input === 'object' && 'type' in input && 'msg' in input) {
                return { msg: input.msg, thing: !state.thing, type: input.type }
            }
            return {msg: 'what?', type: 'e', thing: !state.thing};
        },
        
        clearNoti(state) {
            return { msg: '', thing: !state.thing, type: ''};
        }
    }
})

export const { setNoti, clearNoti } = notiSlice.actions;
export default notiSlice.reducer;