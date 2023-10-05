import axios from 'axios'
axios.defaults.withCredentials = true

const commentURL='https://localhost:8443/api/comment'
const userURL='https://localhost:8443/api/user'
const baseURL='https://localhost:8443/api/'

//GET
async function GetComments(){ //CORS pain, so much
    try{
        const Req = axios.get(commentURL+'/all', {withCredentials:false})
        return Req.then(res=>res.data)
    } catch(e){}
}

async function GetSession(){
    const Req = await axios.get(userURL+'/session')
    return Req.then(res=>res.data)
}

//POST
async function Comment(obj){
    if (obj && obj.target != null) {
        try{
            const Req = axios.post(commentURL+'/new', {content:obj.content, target:obj.target})
            return Req.then(res=>res.data)
        } catch(e){}
    } else {
        try{
            const Req = axios.post(commentURL+'/new', obj)
            return Req.then(res=>res.data)
        } catch(e){}
    }
}

async function Modify(obj){
    try{
        const Req = axios.post(commentURL+'/modify', obj)
        return Req.then(res=>res.data)
    } catch(e){}
}

async function GetPfp(UserPFP){
    if (UserPFP){
        try{
            const Req = axios.post(baseURL+'pic/'+UserPFP)
            return Req.then(res=>res.data)
        } catch(e){}
    }
}

async function Delete(obj){
    try{
        const Req = axios.post(commentURL+'/delete', obj)
        return Req.then(res=>res.data)
    } catch(e){console.log(e)}
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

    GetPfp,

    Delete,

    Vote
}