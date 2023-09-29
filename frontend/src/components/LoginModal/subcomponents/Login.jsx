import PropTypes from 'prop-types';
import PasswordInput from './PasswordInput';
import UsernameInput from './UsernameInput';
import Buttons from './Buttons';
import { useDispatch } from 'react-redux';
import { setNoti } from '../../../reducers/notiReducer';
import { login } from '../../../reducers/userReducer';

const Login = ({ user, pwd, setPwd, setUser, setModal, Header }) => {
    
    const dispatch = useDispatch();

    const submit = async () => {
        if (!isAllowed) { dispatch(setNoti('...')); return; }
        dispatch(login(user, pwd));
    };

    const isAllowed = !!user && !!pwd;

    return (
        <div>
            <Header txt='Login pls' />
            <UsernameInput user={user} setUser={setUser} />
            <PasswordInput pwd={pwd} setPwd={setPwd} />
            <Buttons txt='Login' submit={submit} setModal={setModal} isAllowed={isAllowed}/>
        </div>
    );
};

Login.propTypes = {
    user: PropTypes.string,
    pwd: PropTypes.string,
    setPwd: PropTypes.func,
    setUser: PropTypes.func,
    setModal: PropTypes.func,
    Header: PropTypes.func
};

export default Login;