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
//CORS is eating my sanity
const App = () => {
  const [messages, setMessages] = useState(null)
  const [del, setDel] = useState(null)

  const dispatch = useDispatch()
  const user = useSelector(x => x.user);
  const [modal, setModal] = useState(true);

  useEffect(()=>{
    API.GetComments().then(res=>setMessages(res.chat))
  }, [])

  useEffect(() => { dispatch(getSession());}, [dispatch]);

  function getAuth(auth){
    if (auth === user.user) {
      return true
    }
    return false
  }

  function Update(){
    API.GetComments().then(res=>setMessages(res.chat))
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

  function SendStuff(e){
    API.Comment({user:user.user, content:e.content}).then(res=>{
      if (res.success == true) {
        Update()
      }
    })
  }

  if (user.user && modal) setModal(false);

  return (
    <div className='Room'>
      <Header setModal={setModal}/>
      <Notification />
      <button onClick={console.log(messages)}>print</button>
      {
        del !== null && <DeleteModal
          onFinish={() => {Delete}}
          cancel={() => {setDel(null)}}
        />
      }
      {(messages !== null && messages.length > 0) && messages.map((msg) => {
        let Replies = null
        const Root = new MessageRoot

        const Main = new Message(
          Root,
          Root,
          msg.index,
          msg.user,
          msg.votes,
          msg.text,
          msg.time
        )

        if (msg.children.length > 0) {
          Replies = msg.children.map(Reply => {
            
            const ReplyMSG = new Message(
              Root,
              Main,
              Reply.index,
              Reply.user,
              Reply.votes,
              Reply.text,
              Reply.time
            )

            return(
              <MessageComp
                all={ReplyMSG}

                upv={ReplyMSG.upvote(user.name)}
                downv={ReplyMSG.downvote(user.name)}
                unv={ReplyMSG.unvote(user.name)}
                del={(e)=>{setDel(e)}}
                update={Update}

                things={Reply}
                isAuthor={getAuth(Reply.user)}
                key={Reply.index}
              />
            )
          })
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

            things={msg}
            isAuthor={getAuth(msg.user)}
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
      })}
      {!user.user && modal && <Modal setModal={setModal}/>}
      <Send
        user={user}
        onFinish={SendStuff}
      />
    </div>
  )
}

export default App