import axios from 'axios'

const commentURL='https://localhost:8443/api/comment'
const userURL='https://localhost:8443/api/user'

//GET
async function GetComments(){ //get all comments
    const Req = axios.get(commentURL+'/all')
    return Req.then(res=>res.body)
}

async function GetSession(){
    const Req = axios.get(userURL+'/session')
    return Req.then(res=>res.body)
}

//POST
async function Comment(obj){
    const Req = axios.post(commentURL+'/new', obj)
    return Req.then(res=>res.body)
}

async function Modify(){
    const Req = axios.post(commentURL, )
}

async function Delete(){
    const Req = axios.post(commentURL+'/delete')
    return Req.then(res=>res.body)
}

async function Vote(){
    const Req = axios.post(commentURL+'/vote')
    return Req.then(res=>res.data)
}

export default{
    GetComments,

    GetSession,

    Comment,

    Modify,

    Delete,

    Vote
}