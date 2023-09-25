import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearNoti } from '../reducers/notiReducer';
import './css/notification.css';

const getStyle = (type) => {
    const red = 'rgba(200,0,0,1)' //these dont look so good lol
    const green = 'rgba(0,200,0,1)'
    console.log('type ', type)
    if (!type) return {}
    switch(type) {
        case 'e':
            return {borderColor: red, color: red};
        case 's':
            return {borderColor: green, color: green};
        default:
            return {}
    }
}

const Notification = () => {
    const dispatch = useDispatch();
    const ref = useRef(null);
    const noti = useSelector(x => x.notification);
    const msg = noti.msg;

    useEffect(() => {
        if (ref.timer) clearTimeout(ref.timer);
        if (msg) { ref.timer = setTimeout(() => dispatch(clearNoti()), 2500); }
    }, [noti, dispatch, msg]);

    const style = getStyle(noti.type);

    if (!msg) return null;
    return (
        <div className={`notification`} style={style} onClick={() => dispatch(clearNoti())}>
            <h3>{msg}</h3>
        </div>
    );
};

export default Notification;