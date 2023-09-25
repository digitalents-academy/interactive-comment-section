import PasswordInput from './PasswordInput';
import UsernameInput from './UsernameInput';
import Buttons from './Buttons';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setNoti } from '../../../reducers/notiReducer';

const Register = ({ user, setUser, pfp, setPfp, pwd, setPwd, setModal, Header }) => {
    const dispatch = useDispatch();

    const register = async () => {
        if (!isAllowed) { dispatch(setNoti('...')); return; }
        const formData = new FormData();
        formData.append('png', pfp);
        formData.append('pwhash', pwd);
        formData.append('name', user);
        try {
            const res = await fetch('https://localhost:8443/api/user/new', {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            if (!result.success) {
                dispatch(setNoti(`Error: ${result?.error}!`));
                return;
            }
            setModal(false);
        }
        catch(e) { 
            dispatch(setNoti({msg: String(e), type: 'e'})); console.log(e);
        }
    }

    const doSomething = (e) => { 
        e.target.files[0] && setPfp(e.target.files[0]);
    };

    const isAllowed = user.length > 1 && pwd.length && pfp;

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
            <Buttons setModal={setModal} txt='Register' isAllowed={isAllowed} submit={register}/>    
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