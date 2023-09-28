import {useForm} from 'react-hook-form'

//testing ok

export default function Send({user, onFinish}){
    const {handleSubmit, register, formState:{errors}} = useForm()

    return(
        <form className='Send' onSubmit={handleSubmit(onFinish)}>
            <img className='Pfp' src={user.pfp}></img>
            <textarea className='SendTx' {...register('content')}/>
            <button className='Update' type='submit'>SEND</button>
        </form>
    )
}