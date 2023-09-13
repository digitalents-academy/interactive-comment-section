import { useState } from 'react' //I'm used to react ;-;
import './css/app' //Styling not done properly yet!
import Data from '../data.json' //We'll replace with real data?

import MessageComp from './components/Message'

//Hey! Everything here is temporary as of right now (13.9.2023)
const App = () => {

    const [messages, setMessages] = useState(Data.comments)

    function getAuth(auth){ //This will obviously be replaced
        if (auth === Data.currentUser.username) {
          return true
        }
        return false
    }

    const MappedMessages = messages.map((msg) => {
        //big boi tree
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

    return(
        <div className='Room'>
            {MappedMessages}
        </div>
    )
}

export default App