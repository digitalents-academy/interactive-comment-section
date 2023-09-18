export default function Reply({data}){
    const replyingTo = data.replyingTo || null
    const replyStr = '@'+replyingTo
    return(
        <div className='Replying'>
            <img className='Pfp' src='/assets/avatars/test-pfp.png'></img>
            <textarea className='ReplyTx'>{replyingTo && replyStr}</textarea>
            <button className='ReplyBtn'>REPLY</button>
        </div>
    )
}