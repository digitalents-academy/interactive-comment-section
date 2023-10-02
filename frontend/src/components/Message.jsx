import { useState } from 'react'
import Edit from '../components/Edit'
import Reply from '../components/Reply'

import { UnixToGuess } from '../util/UnixConvert.js' //Unix timestamp converter

import API from '../controllers/api'
//UnixToGuess(UnixTimestamp) -> "# X(s) Ago" 
//^ X = "seconds", "minutes", "hours", "days", "weeks", "months" ^

/*
NEW
*/

export default function Message({all, upv, downv, unv, things, user, del, update, isAuthor}){
    const [editing, setEditing] = useState(null)
    const [replying, setReplying] = useState(null)
    const [vote, setVote] = useState(null)
    const [score, setScore] = useState(0)

    function Vote(set){ //I'm unsure if this will work ;-;
        if ((vote != set) || (vote==null)) { //if vote is different or nonexisting
            if (set == '-') {
                downv
            } else if (set=='+'){
                upv
            }
            API.Vote().then(res=>{
                if (res.success == true) {
                    setScore(res.score)
                }
            })
            setVote(set)
        } else if (vote==set) { //if vote == set we unvote
            unv()
            setVote(null)
        }
    }

    const handleEdit = (e) => { //When edit form is submitted
        console.log(e)
        API.Modify(e).then(res=>{
            if (res.success == true) {
                update()
            }
        })
        setEditing(null)
    }

    const handleReply = (e) => { //When reply form is submitted
        console.log(e)
        API.Comment(e).then(res=>{
            if (res.success == true) {
                update()
            }
        })
        setReplying(null)
    }

    return(
        <div className='MessageContainer'>
            <div className='Message'>

                <div className='Vote'>
                    <img 
                        onClick={()=>{upv; Vote('+')}} 
                        className='Plus CTRL' 
                        src='/assets/plus.svg'
                    />
                    <p className='Votes'>{things.score}</p>
                    <img  
                        onClick={()=>{downv; Vote('-')}} 
                        className='Minus CTRL' 
                        src='/assets/minus.svg'
                    />
                </div>

                <div className='MessageBody'>

                    <div className='Title'>
                        <img className='Pfp' src={things.pfp||null}/>
                        <p className='AuthorName'>{things.user}</p>
                        {
                            isAuthor && <p className='youTag'>you</p>
                        }
                        <p className='Time'>{UnixToGuess(things.timestamp)}</p>
                    </div>

                </div>

                <div className='Controls'>
                    {
                        isAuthor && <button onClick={del} className='Delete'><img className='Del' src='/assets/delete.svg'/> Delete</button>
                    }
                    {
                        isAuthor && <button onClick={()=>setEditing(things.index)} className='Edit'><img className='Ed' src='/assets/edit.svg'/> Edit</button>
                    }
                    {
                        !isAuthor && <button onClick={()=>setReplying(things.index)} className='Reply'><img className='Rep' src='/assets/reply.svg'/> Reply</button>
                    }
                </div>
                {
                editing && <Edit
                        data={all}
                        onFinish={handleEdit}
                />
                }
                {
                    !editing && <p className='Text'>{things.content}</p>
                }
            </div>
            {
                replying && <Reply
                    data={all}
                    onFinish={handleReply}
                />
            }
        </div>
    )
}