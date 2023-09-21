import { useState } from "react";
import PropTypes from 'prop-types';

import './LoginModal.css';
import Register from "./subcomponents/Register";
import Login from "./subcomponents/Login";
import Tabs from './subcomponents/Tabs'

//this feels stupid
const Header = ({txt}) => {
    return (
        <div className="header">
            <h2>{txt}</h2>
        </div>
    )
};

const LoginModal = ({ setModal }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [pfp, setPfp] = useState(null);
    const [onLogin, setOnLogin] = useState(true);

    return (
        <div className='modal-bg'>
            <div className="login-modal">
                <Tabs setTabs={setOnLogin} activetab={onLogin} loginTab={onLogin}/>
                <div className="modal-content">
                    {onLogin ?
                        <Login 
                            user={username} 
                            pwd={password} 
                            setUser={setUsername} 
                            setPwd={setPassword} 
                            setModal={setModal} 
                            Header={Header}
                        /> 
                        :
                        <Register 
                            user={username} 
                            pwd={password} 
                            setUser={setUsername} 
                            setPwd={setPassword} 
                            setModal={setModal} 
                            pfp={pfp} 
                            setPfp={setPfp} 
                            Header={Header}
                        />
                    }
                </div>
            </div>
        </div>
    );
};

LoginModal.propTypes = {
    setModal: PropTypes.func
};

export default LoginModal;