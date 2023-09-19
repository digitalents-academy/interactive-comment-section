/*
import axios from 'axios'

const baseURL='https://localhost:8443/api/chat'

//GET
async function GetChat(){
    const Req = axios.get(baseURL)
    return Req.then(res=>res.data)
}

//POST
async function Chat(obj){
    const Req = axios.post(baseURL, obj)
    return Req.then(res=>res.data)
}

//PATCH
async function Update(id, obj){
    const Req = axios.patch(baseURL+'/'+id)
    return Req.then(res=>res.data)
}

//DEL
async function Delete(id){
    const Req = axios.delete(baseURL+'/'+id)
    return Req.then(res=>res.data)
}

export default{
    GetChat,

    Chat,

    Update,

    Delete
}
*/