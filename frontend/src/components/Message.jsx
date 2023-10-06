import { useState } from 'react'
import Edit from '../components/Edit'
import Reply from '../components/Reply'

import { UnixToGuess } from '../util/UnixConvert.js' //Unix timestamp converter

import API from '../controllers/api'
//UnixToGuess(UnixTimestamp) -> "# X(s) Ago" 
//^ X = "seconds", "minutes", "hours", "days", "weeks", "months", "years" ^

/*
NEW
*/

export default function Message({all, things, del, update, upv, voted, isAuthor, woot, asd}){

    const [editing, setEditing] = useState(null)
    const [replying, setReplying] = useState(null)
    const [vote, setVote] = useState(voted || null)
    const [score, setScore] = useState(0)

    const handleEdit = (e) => { //When edit form is submitted
        if (woot!=null){
            API.Modify({target:woot.target, content:e.content}).then(res=>{
                if (res.success == true && res.a != null) {
                    all.edit(res.a)
                    things.content = res.a
                    update()
                }
            })
        } else {
            API.Modify({target:asd.target, content:e.content}).then(res=>{
                if (res.success == true && res.a != null) {
                    all.edit(res.a)
                    things.content = res.a
                    update()
                }
            })
        }
        setEditing(null)
    }
    const handleReply = (e) => { //When reply form is submitted
        API.Comment({content:e.content,target:asd.target}).then(res=>{
            if (res.success == true) {
                update()
            }
        })
        setReplying(null)
    }

    /*async function Base64ToImage(callback) {
        var im = new Image();
        im.src = PFP;
        im.className='Pfp';
        return im
    }

    const IMG = Base64ToImage()
    const FixedImg = () => {
        return(
            <>
                <img src={PFP.src} className={PFP.className}/>
            </>
        )
    }*/

    return(
        <div className='MessageContainer'>
            <div className='Message'>

                <div className='Vote'>
                    {
                        vote != null && vote == 1 ? 
                        <img 
                            //onClick={()=>{Vote('+')}}
                            className='V2'
                            src='/assets/plus.svg'
                        /> 
                        : 
                        <img 
                            //onClick={upv}
                            className='Plus CTRL'
                            src='/assets/plus.svg'
                        />
                    }
                    <p className='Votes'>{things.score}</p>
                    {
                        vote != null && vote == -1 ? 
                        <img 
                            //onClick={()=>{Vote('+')}}
                            className='V2'
                            src='/assets/minus.svg'
                        /> 
                        : 
                        <img  
                            //onClick={()=>{Vote('-')}} 
                            className='Minus CTRL' 
                            src='/assets/minus.svg'
                        />
                    }
                </div>

                <div className='MessageBody'>

                    <div className='Title'>
                        <img className='Pfp'/>
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
                        isAuthor && <button onClick={()=>{
                            if (editing == null){
                                setEditing(things.index)
                            } else if (editing != null){
                                setEditing(null)
                            }
                        
                        }} className='Edit'><img className='Ed' src='/assets/edit.svg'/> {editing == null ? 'Edit' : 'Cancel'}</button>
                    }
                    {
                        !isAuthor && <button onClick={()=>{
                            if (replying == null) {
                                setReplying(things.index)
                            } else if (replying != null) {
                                setReplying(null)
                            }
                            
                        }} className='Reply'><img className='Rep' src='/assets/reply.svg'/> {replying == null ? 'Reply' : 'Cancel'}</button>
                    }
                </div>
                {
                    editing != null ? <Edit
                        data={things}
                        onFinish={handleEdit}
                /> : <p className='Text'>{(things.content)}</p>
                }
            </div>
            {
                replying != null && <Reply
                    data={things}
                    onFinish={handleReply}
                />
            }
        </div>
    )
}

//<img className='Pfp' src={PFP}/>