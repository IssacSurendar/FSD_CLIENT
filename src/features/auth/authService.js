import axios from '../../utils/config';

const login = async(data) => {
    const response = await axios.post('/api/login', data)
    return response.data;
}


const authService = {
    login
}
export default authService