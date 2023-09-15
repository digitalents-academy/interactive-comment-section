import { useState } from "react";
import PropTypes from 'prop-types';
import './LoginModal.css';

const LoginModal = ({setModal}) => {

    const [username, setUsername] = useState('');
    const [pfp, setPfp] = useState(null);

    const login = async () => {
        if (username.length > 1 /*and something obv*/) {
            const profile = {username: username, pfp: pfp};
            console.log(profile); /* const something = await axios.post(somewhere, profile).then(jotain).catch(jnejne) ???? */
            setModal(false);
            return;
        }
        console.log('username is too short'); //idk
    }

    const doSomething = (e) => {
        if (e.target.files[0]) { setPfp(e.target.files[0]); }
    };

    const color = username.length > 1 ? 'green' : 'hsl(212, 24%, 26%)';

    return (
        <div className='modal-bg'>
            <div className='login-modal'>
                <input type='file' accept="image/*" style={{display: 'none'}} onChange={e => doSomething(e)} className='pfpinput'></input>
                <div className="header">
                    <h3 style={{margin: '10px 0 15px 0'}}>Login pls</h3>
                </div>
                <div className="usernameinput">
                    <p>Username: </p>
                    <input value={username} onChange={e => setUsername(e.target.value)} placeholder='username' style={{outlineColor: color}}></input>
                </div>
                <div className='clickhere'>
                    <p onClick={() => document.querySelector('.pfpinput').click()}>click here add a profile picture</p>
                    {pfp && <img src={URL.createObjectURL(pfp)} alt='pfp' onClick={() => document.querySelector('.pfpinput').click()} onError={() => setPfp(null)}></img>}
                </div>
                <div className="loginbutton">
                    <button onClick={() => login()} style={{filter: username.length < 2 && 'opacity(40%)'}}>Login</button>
                    <button onClick={() => setModal(false)} style={{background: 'red'}}>Close</button>
                </div>
            </div>
        </div>
    );
};

LoginModal.propTypes = {
    set: PropTypes.func
}

export default LoginModal;