import PropTypes from 'prop-types';

const TextInput = ({user, setUser, pwd, setPwd }) => {

    return (
        <div>
            <div className="usernameinput">
                <p>Username: </p> 
                <input value={user} onChange={e => setUser(e.target.value)} placeholder='username'></input>
            </div>
            <div className="passwordinput">
                <p>Password: </p>
                <input value={pwd} onChange={e => setPwd(e.target.value)} placeholder='password' type='password'></input>
            </div>
        </div>
    );
};

TextInput.propTypes = {
    user: PropTypes.string,
    setUser: PropTypes.func,
    pwd: PropTypes.string,
    setPwd: PropTypes.func,
};

export default TextInput;