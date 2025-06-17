import axios from '../../utils/config';

const updateTask = async(data) => {
    const response = await axios.put('/api/task', data)
    return response.data;
}

const createTask = async(data) => {
    const response = await axios.post('/api/task', data)
    return response.data
}

const deleteTask = async(data) => {
    console.log(data)
    const response = await axios.delete('/api/task', {data: data})
    return response.data
}

const taskService = {
    deleteTask,
    createTask,
    updateTask
}

export default taskService