export default function Edit({data, onFinish, ogSize}){ 
    //data={replyingTo, content}
    const rep = data.replyingTo || null
    const con = data.content
    let str = null
    if (rep) {
        str = '@'+rep+' '+con
    } else (
        str = con
    )
    return(
        <div className='Editing'>
            <textarea className='EditTx' defaultValue={str}/>
            <button className='Update'>UPDATE</button>
        </div>
    )
}

//<textarea>{data.replyingTo && <span className='Tag'>@{data.replyingTo}</span>} {data.content}</textarea>