import PasswordInput from './PasswordInput';
import UsernameInput from './UsernameInput';
import Buttons from './Buttons';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setNoti } from '../../../reducers/notiReducer';
import { register } from '../../../reducers/userReducer';
import { useState } from 'react';

const Register = ({ user, setUser, pwd, setPwd, setModal, Header }) => {
    const dispatch = useDispatch();
    const [pfp, setPfp] = useState(null);

    const submit = async () => {
        if (!isAllowed) { dispatch(setNoti('...')); return; }
        dispatch(register(user, pwd, pfp));
    }

    const doSomething = (e) => { 
        e.target.files[0] && setPfp(e.target.files[0]);
    };

    const isAllowed = !!user && !!pwd && !!pfp;

    return (
        <div>
            <Header txt='Register plss'/>
            <UsernameInput user={user} setUser={setUser} />
            <PasswordInput pwd={pwd} setPwd={setPwd} />
            <input type='file' accept=".png" style={{display: 'none'}} onChange={doSomething} className='pfpinput'></input>
            <div className='clickhere'>
                <p onClick={() => document.querySelector('.pfpinput').click()}>click here add a profile picture</p>
                {pfp && 
                    <img src={URL.createObjectURL(pfp)} alt='pfp' onClick={() => document.querySelector('.pfpinput').click()} onError={() => setPfp(null)} />
                }
            </div>
            <Buttons setModal={setModal} txt='Register' isAllowed={isAllowed} submit={submit}/>    
        </div> 
    );
};

Register.propTypes = {
    user: PropTypes.string,
    pwd: PropTypes.string,
    setPwd: PropTypes.func,
    setUser: PropTypes.func,
    setModal: PropTypes.func,
    pfp: PropTypes.instanceOf(File),
    Header: PropTypes.func,
    setPfp: PropTypes.func
};

export default Register; 

/*

*/