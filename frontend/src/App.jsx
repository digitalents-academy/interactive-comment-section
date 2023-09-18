import { useState } from 'react'
import MessageComp from './components/Message'
import Modal from './components/LoginModal'
import Data from '../../data.json'//Change for real data(?)
import './css/App.css'

const Username = Data.currentUser.username//Temporary

import MessageComp from './components/Message'
import Send from './components/Send'

const App = () => {
  const [messages, setMessages] = useState(Data.comments)
  const [modal, setModal] = useState(true);

  function getAuth(auth){ //Change when we have epic data
    if (auth === Username) {
      return true
    }
    return false
  }

  const MappedMessages = messages.map((msg) => {
      //big boi comment & reply tree
      let Replies = null
      
      if (msg.replies.length > 0) {
        Replies = msg.replies.map(reply => <MessageComp
            isAuthor={getAuth(reply.user.username)}
            data={reply}
            key={reply.id}
          />
        )
      }

      return(
        <div className='MessageTree'>
          <MessageComp 
            isAuthor={getAuth(msg.user.username)} 
            data={msg}
            key={msg.id}
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

  return (
    <div className='Room'>
      {MappedMessages}
      {modal && <Modal setModal={setModal} />}
    </div>
  )
}

export default App
