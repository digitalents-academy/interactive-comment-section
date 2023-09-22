import PropTypes from 'prop-types';
import PasswordInput from './PasswordInput';
import UsernameInput from './UsernameInput';
import Buttons from './Buttons';
import * as util from '../../../../../common_lib/util.js'
import { useDispatch } from 'react-redux';
import { setNoti } from '../../../reducers/notiReducer';

const Login = ({ user, pwd, setPwd, setUser, setModal, Header }) => {

    const dispatch = useDispatch()

    const login = async () => {
        if (!isAllowed) { console.log('noup'); return; }
        const hash = await util.sha256str(pwd);
        const obj = { name: user, pwhash: hash };
        try {
            const res = await fetch('https://localhost:8443/api/user/login', {
                method: 'POST',
                body: JSON.stringify(obj), 
                headers: { "Content-Type": "application/json" }            
            });
            const result = await res.json();
            if (!result.success) {
                dispatch(setNoti(`Error: ${result?.error}!`));
                return;
            }
            setModal(false);
        }
        catch(e) { dispatch(setNoti(String(e))); }
    };

    const isAllowed = user.length > 1 && !!pwd;

    return (
        <div>
            <Header txt='Login pls' />
            <UsernameInput user={user} setUser={setUser} />
            <PasswordInput pwd={pwd} setPwd={setPwd} />
            <Buttons txt='Login' submit={login} setModal={setModal} isAllowed={isAllowed}/>
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