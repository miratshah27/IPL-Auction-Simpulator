import axios from "axios";

// const BackendUrl = 'http://127.0.0.1:8000/api/';
// const mediaUrl = 'http://127.0.0.1:8000/media/';
const BackendUrl = 'https://spit-ipl-auction.in/api/'
const mediaUrl = 'https://spit-ipl-auction.in/media/'

const axiosInstance = axios.create({
    baseURL : BackendUrl,
    timeout : 10000,
    headers :{
        'Content-Type' : 'application/json',
        accept : 'application/json',
        token : localStorage.getItem('token')?localStorage.getItem('token'):null,
        "Access-Control-Allow-Origin":"*",
        'Access-Control-Allow-Credentials':true
    }
})

export default axiosInstance
export {mediaUrl};