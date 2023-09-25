import PropTypes from 'prop-types'

const Tabs = ({setTabs, loginTab}) => {

    const activeStyle = { backgroundColor: 'hsl(223, 19%, 93%)', filter: 'saturate(0%)', borderBottom: '1px solid black'};
    
    return (
        <div className='tabs'>
            <div className='left-tab' onClick={() => {setTabs(true)}} style={!loginTab ? activeStyle : null}>
                <h5 style={{textDecoration: loginTab && 'solid underline 1px'}}>Login</h5>
            </div>
            <div className='right-tab' onClick={() => {setTabs(false)}} style={loginTab ? activeStyle : null}>
                <h5 style={{textDecoration: !loginTab && 'solid underline 1px'}}>Register</h5>
            </div>
        </div>
    );
};

Tabs.propTypes = {
   setTabs: PropTypes.func,
   loginTab: PropTypes.bool
}

export default Tabs;

/*
, boxShadow: '20px -3px 23px -1px rgba(0,0,0,0.54) inset;'
*/