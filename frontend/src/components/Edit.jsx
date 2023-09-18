import {useForm} from 'react-hook-form'

export default function Edit({data, onFinish, ogSize}){ 
    //data={replyingTo, content}
    const {handleSubmit, register, formState:{errors}} = useForm()

    const rep = data.replyingTo || null
    const con = data.content
    let str = null
    if (rep) {
        str = '@'+rep+' '+con
    } else (
        str = con
    )
    return(
        <form onSubmit={handleSubmit(onFinish)} className='Editing'>
            <textarea {...register('content')} className='EditTx' defaultValue={str}/>
            <button type='submit' className='Update'>UPDATE</button>
        </form>
    )
}

//<textarea>{data.replyingTo && <span className='Tag'>@{data.replyingTo}</span>} {data.content}</textarea>