import axios from '../../utils/config';

const getProject = async() => {
    const response = await axios.get('/api/project')
    return response.data;
}

const createProject = async(data) => {
    const response = await axios.post('/api/project', data)
    return response.data
}

const deleteProject = async(data) => {
    console.log(data)
    const response = await axios.delete('/api/project', {data: data})
    return response.data
}

const updateProject = async(data) => {
    const response = await axios.put('/api/project', data)
    return response.data
}


const projectService = {
    getProject,
    createProject,
    deleteProject,
    updateProject
}
export default projectService