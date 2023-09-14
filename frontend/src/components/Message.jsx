import { useState } from 'react'
import Edit from '../components/Edit'

export default function Message({isAuthor, data}){
    
    const [editing, setEditing] = useState(null)

    const handleEdit = (e) => {
        console.log(e)
        setEditing(null)
    }

    return(
        <div className='Message'>

            <div className='Vote'>
                <img className='Plus CTRL' src='/assets/plus.svg'/>
                <p className='Votes'>{data.score}</p>
                <img className='Minus CTRL' src='/assets/minus.svg'/>
            </div>

            <div className='MessageBody'>

                <div className='Title'>
                    <img className='Pfp' src={data.user.image.png}/>
                    <p className='AuthorName'>{data.user.username}</p>
                    {
                        isAuthor && <p className='youTag'>you</p>
                    }
                    <p className='Time'>{data.createdAt}</p>
                </div>

            </div>

            <div className='Controls'>
                {
                    isAuthor && <button className='Delete'><img className='Del' src='/assets/delete.svg'/> Delete</button>
                }
                {
                    isAuthor && <button onClick={()=>setEditing(data.id)} className='Edit'><img className='Ed' src='/assets/edit.svg'/> Edit</button>
                }
                {
                    !isAuthor && <button className='Reply'><img className='Rep' src='/assets/reply.svg'/> Reply</button>
                }
            </div>
            {
               editing ? <Edit
                    data={data}
                    onFinish={handleEdit}
               />
               : <p className='Text'>{data.replyingTo && <span className='Tag'>@{data.replyingTo}</span>} {data.content}</p>
            }
        </div>
    )
}