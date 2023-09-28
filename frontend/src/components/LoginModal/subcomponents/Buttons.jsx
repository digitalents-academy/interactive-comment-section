import PropTypes from 'prop-types'

const Buttons = ({txt, setModal, isAllowed, submit}) => {
    return (
        <div className="loginbutton">
            <button onClick={() => submit()} style={{filter: !isAllowed && 'opacity(30%)'}}>{txt}</button>
        </div>
    )
}

Buttons.propTypes = {
    txt: PropTypes.string,
    setModal: PropTypes.func,
    isAllowed: PropTypes.bool,
    submit: PropTypes.func
}

export default Buttons;