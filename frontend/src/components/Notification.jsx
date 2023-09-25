import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearNoti } from '../reducers/notiReducer';
import './css/notification.css';

const Notification = () => {
    const dispatch = useDispatch();
    const ref = useRef(null);
    const noti = useSelector(x => x.notification);
    const current = noti.current;

    useEffect(() => {
        if (ref.timer) clearTimeout(ref.timer);
        if (current) { ref.timer = setTimeout(() => dispatch(clearNoti()), 2500); }
    }, [noti, dispatch, current]);

    if (!current) return null;
    return (
        <div className='notification' onClick={() => dispatch(clearNoti())}>
            <h3>{current}</h3>
        </div>
    );
};

export default Notification;
