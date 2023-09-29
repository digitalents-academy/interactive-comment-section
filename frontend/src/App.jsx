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
  const [modal, setModal] = useState(false);

  useEffect(()=>{
    async function FetchComments(){
      console.log('hello pls')
      try{
        const Comments = await API.GetComments()
        console.log(Comments.chat)
        setMessages(Comments.chat)
      } catch(e){
        console.error(e)
      }
    }
    FetchComments()
  }, [])
  //don't know if if localstorage is a good idea but it's less red in console :D (while not logged in) (and gets rid of flashing login thing)
  useEffect(() => { localStorage.getItem('logged') ? dispatch(getSession()) : setModal(true)}, [dispatch]);

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

                user={{name:ReplyMSG.user.name, pfp:ReplyMSG.user.pfp}}
                isAuthor={getAuth(ReplyMSG.user.name)}
                key={ReplyMSG.index}
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
      })}
      {!user.user && modal && <Modal setModal={setModal}/>}
      <Send
        user={user}
      />
    </div>
  )
}

export default App