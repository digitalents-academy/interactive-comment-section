import PropTypes from 'prop-types';

const PasswordInput = ({pwd, setPwd}) => {
    return (
        <div className="passwordinput">
            <p>Password: </p>
            <input value={pwd} onChange={e => setPwd(e.target.value)} placeholder='password' type='password'></input>
        </div>
    )
};

PasswordInput.propTypes = {
    pwd: PropTypes.string,
    setPwd: PropTypes.func
};

export default PasswordInput;