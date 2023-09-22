import { useDispatch, useSelector } from 'react-redux'
import { clearNoti } from '../reducers/notiReducer';
import './css/notification.css';

//todo: notification timeout, refresh on same message and maybe notification type,
//i've tried timeouts and other stuff but something spooky is going on. (or i am stupid (likely!))
const Notification = () => {

    const dispatch = useDispatch()
    const noti = useSelector(x => x.notification);

    if (noti === '') return null;
    return (
        <div className={`notification`} onClick={() => dispatch(clearNoti())}>
            <h3>{noti}</h3>
        </div>
    );
};

export default Notification;