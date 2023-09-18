import {useForm} from 'react-hook-form'

export default function Send({onFinish}){
    const {handleSubmit, register, formState:{errors}} = useForm()

    return(
        <form className='Send' onSubmit={handleSubmit(onFinish)}>
            <img className='Pfp' src='/assets/avatars/test-pfp.png'></img>
            <textarea className='SendTx' {...register('content')}/>
            <button className='Update' type='submit'>SEND</button>
        </form>
    )
}