export default function Delete({onFinish, test, cancel}){
    return(
        <div className='DeleteModal'>
            <div className='DelCont'>
                <h1>Delete Comment</h1>
                <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
                <div className='DelCtrl'>
                    <button onClick={cancel} className='DelCancel'>NO, CANCEL</button>
                    <button onClick={test} className='DelAccept'>YES, DELETE</button>
                </div>
            </div>
        </div>
    )
}