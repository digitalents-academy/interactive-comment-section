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

import * as Chat from '../../common_lib/chat';
//I've no idea how to use classes for anything, so I'm learning lol
//In process of using classes for messages, sry X_X
//CORS is eating my sanity

let LoadedUsers = {}

const App = () => {
  const [messages, setMessages] = useState(null)
  const [del, setDel] = useState(null)

  const dispatch = useDispatch()
  const user = useSelector(x => x.user);
  const [modal, setModal] = useState(true);
  const chat = new Chat.MessageRoot()

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
      API.Delete(del).then((res)=>{
        if (res.success == true){
          setDel(null)
          Update()
        }
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

  function GetVote(msg){
    if (msg.votes.length > 0){
      for (let i=0; i<msg.votes.length; i++) {
        if (msg.votes[i] == user.user) {
          console.log(user.user, 'Has Voted for ', msg)
          return true
        }
      }
    }
    return false
  }

  /*function GetPFP(fromUser){ //This clearly doesn't work (at least properly)
    
    if (LoadedUsers[fromUser]!=null || undefined) {
      console.log('User already found!')
      return LoadedUsers[fromUser] 
    } else if (LoadedUsers[fromUser] == null || undefined) {
      const Users = chat.users
      if (Users[fromUser] != null && Users[fromUser].png != null) {
        console.log('USER', fromUser, ' NOT FOUND IN ', LoadedUsers, LoadedUsers[fromUser])
        API.GetPfp(Users[fromUser].png).then(res=>{
          var im = new Image()
          im.className='Pfp'
          im.data = res
          im.decoding = 'sync'
          im.src = 'data:image/png;base64,'+res
          LoadedUsers[fromUser] = im
          return LoadedUsers[fromUser]
        })
      }
    }
  }*/

  let MessagesMapped = null

  if (user.user && modal) setModal(false);
  if (user) chat.addUser(user.user, user.pfp);
  if (messages !== null && user.user && messages.length > 0) {
    MessagesMapped = messages.map((Message, indx) => {
      let Replies = null
      chat.add(Message.user, Message.text)
      const MSG = chat.children[indx]
      //const MSGPFP = GetPFP(Message.user)

      if (Message.children.length > 0) {
        Replies = Message.children.map((Reply, ind) => {
          chat.children[indx].add(Reply.user, Reply.text)
          const RPL = chat.children[indx].children[ind]
          //const RPLPFP = GetPFP(Reply.user)

          return(
            <MessageComp
              all={RPL}

              //PFP={RPLPFP}
              del={() => {RPL && setDel({target: RPL.path(), RealIndex: ind})}}
              update={Update}

              asd={{target: MSG.path()}}
              woot={{target: RPL.path()}}
              things={Reply}
              user={user}
              voted={GetVote(Reply)}
              isAuthor={getAuth(Reply.user)}
              key={ind}
            />
          )
        })
      }
      return(
        <div className='MessageTree'>
          <MessageComp
            all={MSG}

            //PFP={MSGPFP}
            del={() => {MSG && setDel({target: MSG.path(), RealIndex: indx})}}
            update={Update}

            asd={{target: MSG.path()}}
            things={Message}
            user={user}
            voted={GetVote(Message)}
            isAuthor={getAuth(Message.user)}
            key={indx}
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
    })
  }

  return (
    <div className='Room'>
      <Header setModal={setModal}/>
      <Notification />
      {
        del !== null && <DeleteModal
          onFinish={Delete}
          cancel={() => {setDel(null)}}
        />
      }
      {
        MessagesMapped !== null && MessagesMapped
      }
      {!user.user && modal && <Modal setModal={setModal}/>}
      {user.user && <Send
        user={user}
        onFinish={SendStuff}
      />}
    </div>
  )
}

export default App

/*

{(messages !== null && messages.length > 0) && messages.map((msg) => {
        let Replies = null

        const Main = new chat.Message(
          chat,
          this,
          msg.index,
          msg.user,
          msg.votes,
          msg.text,
          msg.time
        )
        const Main = chat.add(msg.user, msg.text)
        const xd = chat.serialize()
        console.log('main:',xd)

        if (msg.children.length > 0) {
          Replies = msg.children.map(Reply => {
            
            const ReplyMSG = new chat.Message(
              chat,
              Main,
              Reply.index,
              Reply.user,
              Reply.votes,
              Reply.text,
              Reply.time
            )
            const ReplyMSG = chat.children.add(Reply.user, Reply.text)
            const flat = chat.children.serializeFlat()
            console.log('flat:',flat)
            return(
              <MessageComp
                all={ReplyMSG}

                upv={ReplyMSG.upvote(user.name)}
                downv={ReplyMSG.downvote(user.name)}
                unv={ReplyMSG.unvote(user.name)}
                del={() => {setDel(ReplyMSG)}}
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
            del={() => {setDel(Main)}}
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
      }

      */