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

async function Modify(obj){
    const Req = axios.post(commentURL+'/modify', obj)
    return Req.then(res=>res.body)
}

async function Delete(obj){
    const Req = axios.post(commentURL+'/delete', obj)
    return Req.then(res=>res.body)
}

async function Vote(obj){
    const Req = axios.post(commentURL+'/vote', obj)
    return Req.then(res=>res.body)
}

export default{
    GetComments,

    GetSession,

    Comment,

    Modify,

    Delete,

    Vote
}