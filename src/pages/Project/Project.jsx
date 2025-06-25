import { Link, useNavigate } from 'react-router-dom';
import {Table, Button} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchProjectData } from '../../features/project/projectSlice';
import projectService from '../../features/project/projectService';
import * as Icon from 'react-bootstrap-icons';
import CreateProjectCanvas from '../../components/OffCanvasEnd/Project/Project';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { formatDate, ProjectStatus } from '../../utils/constants';
import { Alert } from 'react-bootstrap';



 

export default function Project(){

    const [editShow, setEdiShow] = useState(false);
    const handleEditClose = () => setEdiShow(false);
    const handleEditShow = () => setEdiShow(true);
    const [taskModal, setTaskModal] = useState({})
    const [status, setTaskStatus] = useState([])
    const [apiMessageShow, setApiMessageShow] = useState(false);
    const [newStatus, setNewStatus] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {user} = useSelector((state) => state.auth)


    const [project, setProject] = useState([])

    const getProject = async() => {
        const response = await dispatch(fetchProjectData()).unwrap()
        if (response?.result){
            setProject(response.result)
        }
    }

    useEffect(() => {
        getProject()
        if(user?.role != 'Admin'){
            navigate('/access-denied')
        }
    }, [])


    async function deleteProjectById(id){
        const checkPrompt = window.prompt("Type DELETE to confirm");
        if (checkPrompt == 'DELETE'){
            const payload = {
                "id": id.toString()
            }
            const response = await projectService.deleteProject(payload)
            if (response){
                getProject()
                alert(response?.message)
            }
        }
        
    }

    function updateStatus(i){
        setTaskModal(i)
        ProjectStatus.splice(0, 0, i?.status);
        setTaskStatus([...new Set(ProjectStatus)])
    }

    function handleChanges(e){
        // console.log(taskModal)
        const {name, value} = e.target
        setTaskModal((prev) => ({
            ...prev,
            [name]: value
        }))
        if(name == 'status'){
            console.log(e?.target)
            setNewStatus(e?.target?.value)
        }
    }

    async function handleSubmit(e){
        e.preventDefault()
        const formData = {
            'name': taskModal?.name,
            'description': taskModal?.description,
            'status': taskModal?.status,
            'id': taskModal?.id
        }
        projectService.updateProject(formData)
        getProject()
        handleEditClose()
        setApiMessageShow(true)
    }

    useEffect(() => {
        if (apiMessageShow) {
          const timer = setTimeout(() => {setApiMessageShow(false)}, 2000); // 5 seconds
          return () => clearTimeout(timer); // Cleanup on unmount or rerun
        }
      }, [apiMessageShow]);

    return (
        <div>
            <div>
                <span className='mb-3'><b>PROJECTS</b></span>
            
                <CreateProjectCanvas className="float-end" position='end' title='Create Project' onSubmit={getProject}/>
            </div>

            
            {apiMessageShow && (
                    <Alert className='p-2 m-0 mt-2' variant="success" dismissible onClose={() => setApiMessageShow(false)}>
                        <small>Project updated successfully.</small>
                    </Alert>
            )}

            <Table striped bordered hover size="sm" className='mt-3'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Created at</th>
                        <th>Owner</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        project.length === 0 ? (
                            <tr>
                                <td key="1" colSpan="7"> No task found.</td>
                            </tr>
                        )
                        :
                        (
                            project.map((i) => (
                                <tr className='small'>
                                    <td>{'#'+i?.id}</td>
                                    <td>{i?.name}</td>
                                    <td>{i?.description}</td>
                                    <td><span className={i?.status + ' radio box'}>{i?.status}</span></td>
                                    <td>{formatDate(i?.created_at)}</td>
                                    <td>
                                    {
                                        i?.created_by__user__username != '' ? (
                                            <img className='pic' width='25px' src={i?.created_by__picture}/>
                                        ) : (
                                            <span className='txtImg'>{i?.created_by__user__username[0]}</span>
                                        )
                                    }
                                    <span className='picOwner'>{i?.created_by__user__username}</span>
                  
                                        
                                    </td>
                                    <td>
                                        <Button variant="primary" onClick={() => {handleEditShow(); updateStatus(i); }}>
                                            <Icon.PencilSquare />
                                        </Button>
                                        <Button variant="danger" onClick={() => {deleteProjectById(i?.id);}}>
                                            <Icon.X />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )
                    }

                </tbody>
            </Table>

            <Modal show={editShow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='me-auto'>
                        Update Project
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} >
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInp2">
                                <Form.Label className='small mb-1 fw-bold'>Name</Form.Label>
                                <Form.Control type="text" name="name" value={taskModal?.name} onChange={handleChanges} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInp3">
                                <Form.Label className='small mb-1 fw-bold'>Description</Form.Label>
                                <Form.Control type="textarea" rows={3} name="description" onChange={handleChanges} value={taskModal?.description}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInp4">
                                <Form.Label className='small mb-1 fw-bold'>Status</Form.Label>
                                <Form.Select name="status" onChange={handleChanges} aria-label="Default select example">
                                    {
                                        status.map((val, idx) => (
                                            <option value={val}>{val}</option>
                                        ))
                                    }
                                </Form.Select>
                            </Form.Group>
                            <Button type="submit" className='modalbtn mb-2' variant="primary">
                                Submit
                            </Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </div>
    )
}