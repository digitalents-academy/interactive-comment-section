import PasswordInput from './PasswordInput';
import UsernameInput from './UsernameInput';
import Buttons from './Buttons';
import PropTypes from 'prop-types';

const Register = ({ user, setUser, pfp, setPfp, pwd, setPwd, setModal, Header }) => {
    const register = async () => {
        if (!isAllowed) { console.log('no'); return; }
        const formData = new FormData();
        formData.append('png', pfp);
        formData.append('pwdhash', pwd);
        formData.append('name', user);
        try {
            const res = await fetch('https://localhost:8443/api/user/new', {
                method: 'POST',
                body: formData
            });
            const a = await res.json();
            console.log(a);
        }
        catch(e) { console.log('ee', e) }
        setModal(false);
    }

    const doSomething = (e) => { 
        e.target.files[0] && setPfp(e.target.files[0]); 
    };

    const isAllowed = user.length > 1 && pwd.length > 0;
    const color = isAllowed ? 'green' : 'hsl(212, 24%, 26%)';

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