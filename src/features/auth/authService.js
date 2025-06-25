import axios from '../../utils/config';

const login = async(data) => {
    try{
        const response = await axios.post('/api/login', data)
        return response.data
    }catch(error){
        return error.response
    }
}


const authService = {
    login
}
export default authService