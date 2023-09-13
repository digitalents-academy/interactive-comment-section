import { useState } from 'react'
import MessageComp from './components/Message'
import './css/App.css'
import Data from '../../data.json'
const Username = Data.currentUser.username

const App = () => {
  const [messages, setMessages] = useState(Data.comments)

  function getAuth(auth){
    if (auth === Username) {
      return true
    }
    return false
  }

  const MappedMessages = messages.map((msg) => {

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
    </div>
  )
}

export default App
