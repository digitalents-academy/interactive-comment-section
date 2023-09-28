import { useState, Component } from 'react'
import Edit from '../components/Edit'
import Reply from '../components/Reply'

import { UnixToGuess } from '../util/UnixConvert.js' //Unix timestamp converter

import API from './controllers/api'
//UnixToGuess(UnixTimestamp) -> "# X(s) Ago" 
//^ X = "seconds", "minutes", "hours", "days", "weeks", "months" ^

/*
NEW
*/

export default function Message({all, upv, downv, unv, isAuthor}){
    
    const [editing, setEditing] = useState(null)
    const [replying, setReplying] = useState(null)

    const handleEdit = (e) => { //When edit form is submitted
        console.log(e)
        API.Modify(e).then(res=>{

        })
        setEditing(null)
    }

    const handleReply = (e) => { //When reply form is submitted
        console.log(e)
        API.Comment(e).then(res=>{

        })
        setReplying(null)
    }

    return(
        <div className='MessageContainer'>
            <div className='Message'>

                <div className='Vote'>
                    <img onClick={upv} className='Plus CTRL' src='/assets/plus.svg'/>
                    <p className='Votes'>{all.score}</p>
                    <img onClick={downv} className='Minus CTRL' src='/assets/minus.svg'/>
                </div>

                <div className='MessageBody'>

                    <div className='Title'>
                        <img className='Pfp' src={all.user.png}/>
                        <p className='AuthorName'>{all.user.name}</p>
                        {
                            isAuthor && <p className='youTag'>you</p>
                        }
                        <p className='Time'>{UnixToGuess(all.timestamp)}</p>
                    </div>

                </div>

                <div className='Controls'>
                    {
                        isAuthor && <button onClick={() => del(all.index)} className='Delete'><img className='Del' src='/assets/delete.svg'/> Delete</button>
                    }
                    {
                        isAuthor && <button onClick={()=>setEditing(all.index)} className='Edit'><img className='Ed' src='/assets/edit.svg'/> Edit</button>
                    }
                    {
                        !isAuthor && <button onClick={()=>setReplying(all.index)} className='Reply'><img className='Rep' src='/assets/reply.svg'/> Reply</button>
                    }
                </div>
                {
                editing && <Edit
                        data={all}
                        onFinish={handleEdit}
                />
                }
                {
                    !editing && <p className='Text'>{all.text}</p>
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