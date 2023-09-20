import PropTypes from 'prop-types';
import PasswordInput from './PasswordInput';
import UsernameInput from './UsernameInput';
import Buttons from './Buttons';

const Login = ({ user, pwd, setPwd, setUser, setModal, Header }) => {

    const login = () => {
        if (!isAllowed) { console.log('epic error message'); return; };
        const profile = { username: user, password: pwd };
        console.log('hello', profile);
        setModal(false);
    };

    const isAllowed = user.length > 1 && pwd.length > 0;
    const color = isAllowed ? 'green' : 'hsl(212, 24%, 26%)';

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