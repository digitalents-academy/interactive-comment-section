import PropTypes from 'prop-types'

const Buttons = ({txt, isAllowed, submit}) => {
    return (
        <div className="loginbutton">
            <button onClick={() => submit()} style={{filter: !isAllowed && 'opacity(30%)'}}>{txt}</button>
        </div>
    )
}

Buttons.propTypes = {
    txt: PropTypes.string,
    isAllowed: PropTypes.bool,
    submit: PropTypes.func
};

export default Buttons;