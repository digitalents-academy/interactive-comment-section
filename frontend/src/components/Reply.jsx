import {useForm} from 'react-hook-form'

export default function Reply({data, onFinish}){

    const {handleSubmit, register, formState:{errors}} = useForm()

    const replyingTo = data.replyingTo || null
    const replyStr = '@'+replyingTo

    return(
        <form onSubmit={handleSubmit(onFinish)} className='Replying'>
            <img className='Pfp' src='/assets/avatars/test-pfp.png'></img>
            <textarea {...register('content')} className='ReplyTx'>{replyingTo && replyStr}</textarea>
            <button type='submit' className='ReplyBtn'>REPLY</button>
        </form>
    )
}