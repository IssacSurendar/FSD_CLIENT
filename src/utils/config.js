import axios from "axios";
import { handleUserLogout } from "./auth";


// let { user, token, loading, error } = useSelector((state) => state.auth)
// const token = localStorage.getItem('token')
// console.log(token)
axios.defaults.baseURL = 'http://localhost:8000'
// axios.defaults.headers.post['Content-Type'] = 'application/json';

// axios.interceptors.request.use((value) => {

// })
// if (token){
//     axios.defaults.headers.post['Authorization'] = token;
// }

const commonConfig = {
    headers : {
        "Content-Type": "application/json"
    }
}

const axiosReq = axios.create(commonConfig)

axiosReq.interceptors.request.use((config) => {
    // let ShowLoader = true
    const token = localStorage.getItem('token')
    if (token){
        config['headers']['Authorization'] = token
    }
    return config
})

axiosReq.interceptors.response.use(
    // success
   function(response){
    return response;
   },
   function(error){
    if(error?.response.status === 401){
        // store.dispatch(logout())
        handleUserLogout()
    }
   }
)

export default axiosReq