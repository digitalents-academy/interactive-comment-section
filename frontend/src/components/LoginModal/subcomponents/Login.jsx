import PropTypes from 'prop-types';
import TextInput from './TextInput';
import Buttons from './Buttons';
import { useDispatch } from 'react-redux';
import { setNoti } from '../../../reducers/notiReducer';
import { login } from '../../../reducers/userReducer';

const Login = ({ user, pwd, setPwd, setUser, Header }) => {
    
    const dispatch = useDispatch();

    const submit = async () => {
        if (!isAllowed) { dispatch(setNoti('...')); return; }
        dispatch(login(user, pwd));
    };

    const isAllowed = !!user && !!pwd;

    return (
        <div>
            <Header txt='Login pls' />
            <TextInput user={user} setUser={setUser} pwd={pwd} setPwd={setPwd} />
            <Buttons txt='Login' submit={submit} isAllowed={isAllowed} />
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