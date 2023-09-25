import axios from 'axios'

const baseURL='https://localhost:8443/api/comment'

//GET
async function GetComments(){
    const Req = axios.get(baseURL+'/all')
    return Req.then(res=>res.data)
}

//POST
async function Comment(obj){
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
    const Req = axios.delete(baseURL+'/delete'+id)
    return Req.then(res=>res.data)
}

export default{
    GetComments,

    Comment,

    Update,

    Delete
}