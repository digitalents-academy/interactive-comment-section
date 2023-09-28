import {useForm} from 'react-hook-form'

export default function Reply({data, onFinish}){

    const {handleSubmit, register, formState:{errors}} = useForm()

    return(
        <form onSubmit={handleSubmit(onFinish)} className='Replying'>
            <img className='Pfp' src={data.user.pfp}></img>
            <textarea {...register('content')} className='ReplyTx'></textarea>
            <button type='submit' className='ReplyBtn'>REPLY</button>
        </form>
    )
}