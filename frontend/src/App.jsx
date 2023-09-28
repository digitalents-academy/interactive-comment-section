import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import MessageComp from './components/Message'
import Modal from './components/LoginModal'
//import API from './controllers/api' //GetChat (Get), Chat (Create), Update, Delete
import Data from '../../data.json'//Change for real data(?)
import Send from './components/Send'
import Notification from './components/Notification'
import { useDispatch } from 'react-redux'
import { logOff, setUser, getSession } from './reducers/userReducer'

import './css/App.css'

const Username = Data.currentUser.name//Temporary
import DeleteModal from './components/Delete'

const App = () => {
  const [messages, setMessages] = useState(Data.comments)
  const [del, setDel] = useState(null)

  const dispatch = useDispatch()
  const user = useSelector(x => x.user);
  const [modal, setModal] = useState(true);

  /*useEffect(()=>{
      API.GetChat().then(res=>{
        setMessages(res)
      })
  })*/

  useEffect(() => { dispatch(getSession()); }, [dispatch]);

  function getAuth(auth){ //Change when we have epic data
    if (auth === Username) {
      return true
    }
    return false
  }

  function handleDel(ID) {
    setDel(ID)
  }

  function Delete(){
    setDel(null)
  }

  const MappedMessages = messages.map((msg) => {
      //big boi comment & reply tree
      let Replies = null
      
      if (msg.children.length > 0) {
        Replies = msg.children.map(reply => <MessageComp
            isAuthor={getAuth(reply.user.name)}
            data={reply}
            handleDel={handleDel}
            key={reply.index}
          />
        )
      }

      return(
        <div className='MessageTree'>
          <MessageComp 
            isAuthor={getAuth(msg.user.name)} 
            data={msg}
            handleDel={handleDel}
            key={msg.index}
          />
          {
            Replies && 
            <div className='Replies'>
              <div className='Divider'>
                <div className='DividerCenter'/>
              </div>
              <div className='RepliesContainer'>
                {Replies}
              </div>
            </div>
          }
        </div>
      )
    }
  )

  if (user.user && modal) setModal(false);

  return (
    <div className='Room'>
      {user.user && <a onClick={() => dispatch(logOff())}>{'log off (just for testing)'}</a>}
      {!user.user && !modal && <a onClick={() => setModal(true)}>{'open login thing (testing also)'}</a>}
      <Notification />
      {MappedMessages}
      {!user.user && modal && <Modal setModal={setModal}/>}
    </div>
  )
}

export default App
