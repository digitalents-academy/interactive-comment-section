import {useForm} from 'react-hook-form'

export default function Edit({data, onFinish}){ 
    //data={replyingTo, content}
    const {handleSubmit, register, formState:{errors}} = useForm()

    const tx = data.text

    return(
        <form onSubmit={handleSubmit(onFinish)} className='Editing'>
            <textarea {...register('content')} className='EditTx' defaultValue={tx}/>
            <button type='submit' className='Update'>UPDATE</button>
        </form>
    )
}

//<textarea>{data.replyingTo && <span className='Tag'>@{data.replyingTo}</span>} {data.content}</textarea>