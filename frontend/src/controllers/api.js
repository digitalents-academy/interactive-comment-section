import axios from 'axios'
axios.defaults.withCredentials = true

const commentURL='https://localhost:8443/api/comment'
const userURL='https://localhost:8443/api/user'

//GET
async function GetComments(){ //CORS pain, so much
    try{
        const Req = axios.get(commentURL+'/all', {withCredentials:false})
        console.log('TRYING')
        return Req.then(res=>res.data)
    } catch(e){console.log(e)}
}

async function GetSession(){
    const Req = await axios.get(userURL+'/session')
    return Req.then(res=>res.data)
}

//POST
async function Comment(obj){
    const Req = await axios.post(commentURL+'/new', obj)
    return Req.then(res=>res.data)
}

async function Modify(obj){
    const Req = await axios.post(commentURL+'/modify', obj)
    return Req.then(res=>res.data)
}

async function Delete(obj){
    const Req = await axios.post(commentURL+'/delete', obj)
    return Req.then(res=>res.data)
}

async function Vote(obj){
    const Req = await axios.post(commentURL+'/vote', obj)
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