export default function Message({isAuthor, data}){
    
    return(
        <div className='Message'>

            <div className='Vote'>
                <img className='Plus CTRL' src={'../../../images/icon-plus.svg'}/>
                <p className='Votes'>{data.score}</p>
                <img className='Minus CTRL' src={'../../../images/icon-minus.svg'}/>
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
                    isAuthor && <p className='Delete'><img className='Del' src={'../../../images/icon-delete.svg'}/> Delete</p>
                }
                {
                    isAuthor && <p className='Edit'><img className='Ed' src={'../../../images/icon-edit.svg'}/> Edit</p>
                }
                {
                    !isAuthor && <p className='Reply'><img className='Rep' src={'../../../images/icon-reply.svg'}/> Reply</p>
                }
            </div>
            
            <p className='Text'>{data.replyingTo && <span className='Tag'>@{data.replyingTo}</span>} {data.content}</p>
        </div>
    )
}