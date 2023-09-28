import { useState, useEffect } from 'react'
import './css/App.css'
import API from './controllers/api' //GetChat (Get), Chat (Create), Update, Delete
//import Data from '../../data.json'//Change for real data(?)
//const Username = Data.currentUser.name//Temporary

import MessageComp from './components/Message'
import Send from './components/Send'
import DeleteModal from './components/Delete'

let currentUser = null

import { hydrateMessage, MessageRoot, Message, User } from '../../common_lib/chat'
//I've no idea how to use classes for anything, so I'm learning lol
//In process of using classes for messages, sry X_X
const App = () => {
  const [messages, setMessages] = useState(Data.comments)
  const [del, setDel] = useState(null)
  const [user, setUser] = useState({})

  useEffect(()=>{
      API.GetComments().then(res=>{
        setMessages(res)
      })

      const User = localStorage.getItem('user')
      const Pfp = localStorage.getItem('pfp')

      if (User !== null && Pfp !== null) { //check localstorage for user & pfp
        currentUser = {user:User, pfp:Pfp}
      } else { //if null try to get session
        API.GetSession().then(res=>{
          if (res.name !== null) {
            setUser({user:res.name, pfp:res.pfp})
          }
        })
      }
  })

  function getAuth(auth){ //Change when we have epic data
    if (auth === currentUser.user) {
      return true
    }
    return false
  }

  const handleDel = (ID) => {
    console.log(ID,' handleDel')
    setDel(ID)
  }

  function Update(){
    API.GetComments().then(res=>{
      setMessages(res)
    })
  }

  function Delete(){
    API.Delete(del)
    setDel(null)
    Update()
  }



  const MappedMessages = messages.map((msg) => {
      //big boi comment & reply tree
      let Replies = null
      const aRoot = new MessageRoot

      const Main = new Message( //Creating a new message
        aRoot,
        aRoot,
        msg.index,
        msg.user,
        msg.votes,
        msg.text,
        msg.time
      )

      if (msg.children.length > 0) {
        Replies = msg.children.map(reply => {

          const NMSG = new Message(
            aRoot,
            Main,
            reply.index,
            reply.user,
            reply.votes,
            reply.text,
            reply.time
          )
          
            return(
              <MessageComp
                all={NMSG}

                upv={Main.upvote(currentUser.name)}
                downv={Main.downvote(currentUser.name)}
                unv={Main.unvote(currentUser.name)}

                isAuthor={getAuth(NMSG.user.name)}
                key={NMSG.index}
              />
            )
          }
        )
      }

      return(
        <div className='MessageTree'>
          <MessageComp
            all={Main}

            upv={Main.upvote(currentUser.name)}
            downv={Main.downvote(currentUser.name)}
            unv={Main.unvote(currentUser.name)}

            isAuthor={getAuth(Main.user.name)}
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

  return (
    <div className='Room'>
      {
        del !== null && <DeleteModal
          onFinish={Delete}
          cancel={() => {setDel(null)}}
        />
      }
      {MappedMessages}
      <Send/>
    </div>
  )
}

export default App
