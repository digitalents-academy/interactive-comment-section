import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Header from './components/Header'
import MessageComp from './components/Message'
import Modal from './components/LoginModal'
import API from './controllers/api' //GetChat (Get), Chat (Create), Update, Delete
import Send from './components/Send'
import Notification from './components/Notification'
import { useDispatch } from 'react-redux'
import { getSession } from './reducers/userReducer'

import './css/App.css'

import DeleteModal from './components/Delete'

import { MessageRoot, Message } from '../../common_lib/chat'
//I've no idea how to use classes for anything, so I'm learning lol
//In process of using classes for messages, sry X_X
const App = () => {
  const [messages, setMessages] = useState(null)
  const [del, setDel] = useState(null)

  const dispatch = useDispatch()
  const user = useSelector(x => x.user);
  const [modal, setModal] = useState(true);

  async function FetchComments(){
    console.log('hello pls')
    try{
      const Comments = await API.GetComments()
      console.log(Comments)
      setMessages(Comments)
    } catch(e){
      console.error(e)
    }
  }

  useEffect(() => { dispatch(getSession()); FetchComments()}, [dispatch]);

  function getAuth(auth){
    if (auth === user.user) {
      return true
    }
    return false
  }

  function Update(){
    API.GetComments().then(res=>{
      setMessages(res)
    })
  }

  function Delete(){
    if (del !== null) {
      API.Delete(del)
      setDel(null)
      API.GetComments().then(res=>{
        setMessages(res)
      })
    }
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

                upv={NMSG.upvote(user.name)}
                downv={NMSG.downvote(user.name)}
                unv={NMSG.unvote(user.name)}
                del={(e)=>{setDel(e)}}
                update={Update}

                user={{name:NMSG.user.name, pfp:NMSG.user.pfp}}
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

            upv={Main.upvote(user.name)}
            downv={Main.downvote(user.name)}
            unv={Main.unvote(user.name)}
            del={(e)=>{setDel(e)}}
            update={Update}

            user={{name:Main.user.name, pfp:Main.user.pfp}}
            isAuthor={getAuth(Main.user.name)}
            key={Main.index}
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
      <Header setModal={setModal}/>
      <Notification />
      {
        del !== null && <DeleteModal
          onFinish={() => {Delete}}
          cancel={() => {setDel(null)}}
        />
      }
      {MappedMessages}
      {!user.user && modal && <Modal setModal={setModal}/>}
      <Send
        user={user}
      />
    </div>
  )
}

export default App
