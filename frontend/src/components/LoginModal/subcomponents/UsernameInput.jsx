import PropTypes from 'prop-types';

const UsernameInput = ({user, setUser}) => {
    return (
        <div className="usernameinput">
            <p>Username: </p>
            <input value={user} onChange={e => setUser(e.target.value)} placeholder='username'></input>
        </div>
    )
};

UsernameInput.propTypes = {
    user: PropTypes.string,
    setUser: PropTypes.func
};

export default UsernameInput;