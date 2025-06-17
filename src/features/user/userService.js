import axios from '../../utils/config';


const getUser = async(role) => {
    let endPoint = "/api/user"
    if (role != ''){
        endPoint += `?role=${role}`
    }
    const response = await axios.get(endPoint)
    return response.data;
}

const createUser = async(data) => {
    let endPoint = "/api/user"
    const response = await axios.post(endPoint, data)
    return response.data;
}

const updateUser = async(data) => {
    let endPoint = "/api/user"
    const response = await axios.put(endPoint, data)
    return response.data;
}

const deleteUser = async(id) => {
    let endPoint = "/api/user"
    const response = await axios.delete(endPoint, {data:id})
    return response.data;
}


const userService = {
    getUser,
    deleteUser,
    createUser,
    updateUser
}

export default userService