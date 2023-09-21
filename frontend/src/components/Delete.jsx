export default function Delete({onFinish}){
    return(
        <div className='DeleteModal'>
            <div className='DelCont'>
                <h1>Delete Comment</h1>
                <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
                <div className='DelCtrl'>
                    <button className='DelCancel'>NO, CANCEL</button>
                    <button className='DelAccept'>YES, DELETE</button>
                </div>
            </div>
        </div>
    )
}