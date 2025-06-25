import { Link, useNavigate } from 'react-router-dom';
import {Table, Button} from 'react-bootstrap'
import CustomTaskCanvas from '../../components/OffCanvasEnd/Task/Task'
import { useDispatch, useSelector } from 'react-redux';
import {fetchTaskData} from '../../features/taskSlice'
import { setAUth } from '../../utils/auth';
import { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { TaskStatus, UserRole,formatDate } from '../../utils/constants';
import taskService from '../../features/task/taskService';
import CustomUpdateTaskCanvas from '../../components/OffCanvasEnd/Task/updateTask';
import Offcanvas from 'react-bootstrap/Offcanvas';
import userService from '../../features/user/userService';
import projectService from '../../features/project/projectService';
import { Alert } from 'react-bootstrap';



export default  function Dashboard(){
    // console.log('dashboard', user)
    const dispatch = useDispatch();

    const {user} = useSelector((state) => state.auth)

    const [editShow, setEdiShow] = useState(false);
    const handleEditClose = () => setEdiShow(false);
    const handleEditShow = () => setEdiShow(true);
    const [apiMessageShow, setApiMessageShow] = useState(false);


    // setAUth(user)
    const navigate = useNavigate();

    const [task, setTask] = useState([])
    console.log("taskapi call", task)
    const [taskModal, setTaskModal] = useState({})
    const [status, setTaskStatus] = useState([])
    const [newStatus, setNewStatus] = useState('')

    function handleChange(e){
        setNewStatus(e?.target?.value)
    }

    async function handleSubmit(e){
        e.preventDefault()
        if(newStatus != ''){
            const formData = {
                'id': taskModal?.id,
                'status': newStatus
            }
            // console.log(formData)
            taskService.updateTask(formData)
            getTask()
            handleEditClose()
            setApiMessageShow(true);
        }else{
            alert('Please change the status')
        }
        setNewStatus('')
    }

    const getTask = async() => {
        const response =  await dispatch(fetchTaskData()).unwrap();
        if(response){
  
            setTask(response.result);
     
        }
    }

    const [project, setProject] = useState([])
    const [userRole, setUserRole] = useState([])
    const fetchProject = async() => {
      const response =  await projectService.getProject()
      if(response?.result){
          setProject(response.result);
      }
    }


    useEffect (() => {
        getTask(),
        fetchProject()
    }, [])



    function updateStatus(i){
        setTaskModal(i)
        TaskStatus.splice(0, 0, i?.status);
        setTaskStatus([...new Set(TaskStatus)])
    }


    async function onDeleteTask(i){
        // console.log(i)
        const checkPrompt = window.prompt("Type DELETE to confirm");
        if (checkPrompt == 'DELETE'){
            const payload = {
                "id": i?.id.toString()
            }
            const response = await taskService.deleteTask(payload)
            if (response){
                await getTask()
                alert(response?.message)
            }
        }
    }


    
    const [updateFormData, setUpdateFormData] = useState({})
    const [updateShow, setUpdateShow] = useState(false);
    const [due_date, setDueDate] = useState('')
    const updateHandleClose = () => setUpdateShow(false);
    const updateHandleShow = () => setUpdateShow(true);

    // console.log(updateFormData)
    function updateHandleChange(e){
        const {name, value} = e.target
        setUpdateFormData((prev) => ({
            ...prev,
            [name]: value
        }))
  
    }

    async function updateUsersList(i){
        let users_list = []

        const fetchUser = async() => {
            const response =  await userService.getUser('User')

            if(response?.result){
                let user_role = response?.result
                user_role.map((val) => {
                    users_list.push({'id': val?.user__id, 'name': val?.user__username})
                })
            }
        }

        await fetchUser()
        let current_user = {'id':i?.assigned_to__user__id, 'name':i?.assigned_to__user__username}
        const isDuplicate = users_list.some(item => item?.id === current_user?.id);

        if (!isDuplicate) {
            users_list.push(current_user);
        }
        // console.log(users_list)
        setUserRole(users_list)
        // console.log('user', userRole)
        let update_data = {
            'title': i?.title,
            'description': i?.description,
            'status': i?.status,
            'project': i?.project,
            'assigned_to': i?.assigned_to,
            'due_date': '',
            'owner' : i?.owner__id,
            'id': i?.id
        }
        let duedate = i?.due_date
        if(duedate){
            setDueDate(duedate.slice(0,-4))
            update_data['due_date'] = duedate.slice(0,-4)
        }
        // console.log(updateFormData)

        setUpdateFormData(update_data)
    }

    async function updateHandleSubmit(e){
        e.preventDefault()
        let update_data = {
            'title': updateFormData?.title,
            'description': updateFormData?.description,
            'status': updateFormData?.status,
            'project': e.target.project.value,
            'assigned_to': e.target.assigned_to.value,
            'due_date': updateFormData?.due_date,
            'owner' : updateFormData?.owner,
            'id': updateFormData?.id
        }
        // console.log(update_data)
        const response = await taskService.updateTask(update_data)
        if(response?.result){
          // setFormData(intialFormData)
          await getTask()
          updateHandleClose()
          setApiMessageShow(true);
        }
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
                <span className='mb-3'><b>TASKS</b></span>
                {
                    user?.role === 'TaskCreator' || user?.role === 'Admin' ? (
                        <CustomTaskCanvas className="float-end" position='end' title='Create Task' onTaskSubmit={getTask}/>
                    ) : (
                        ''
                    )
                }
            </div>


            {apiMessageShow && (
                <Alert className='p-2 m-0 mt-2' variant="success" dismissible onClose={() => setApiMessageShow(false)}>
                    <small>Task updated successfully.</small>
                </Alert>
            )}

            <Table striped bordered hover size="sm" className='mt-3'>
                <thead> 
                    <tr>
                        <th>Id</th>
                        <th>Project</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Lead</th>
                        <th>Assigned To</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className='small'>
                {
                    task.length === 0 ? (
                        <tr>
                            <td key="1" colSpan="9"><small>No task found.</small></td>
                        </tr>
                    ) 
                    : 
                    (
                        task.map((i) => (
                            <tr>
                                <td><small>{'#'+i?.id}</small></td>
                                <td><small>{i?.project__name}</small></td>
                                <td>
                                <small>{i?.title}</small><br/>
                                </td>
                                <td> <small>{i?.description}</small></td>
                                <td><small>{formatDate(i?.due_date)}</small></td>
                                <td ><span className={i?.status + ' radio box'}>{i?.status}</span></td>
                                <td>
                                    {
                                        i?.owner__picture != '' ? (
                                            <img className='pic' width='25px' src={i?.owner__picture}/>
                                        ) : (
                                            <span className='txtImg'>{i?.owner__user__username[0]}</span>
                                        )
                                    }
                                    <span className='picOwner'>{i?.owner__user__username}</span>
                                </td>
                                <td>
                                    
                                    {
                                        i?.assigned_to__picture != '' ? (
                                            <img className='pic' width='25px' src={i?.assigned_to__picture}/>
                                        ) : (
                                            <span className='txtImg'>{i?.assigned_to__user__username[0]}</span>
                                        )
                                    }
                                    <span className='assignTxt'>{i?.assigned_to__user__username}</span>
                                  
                                
                                </td>
                                <td>
                                    {
                                        user?.role === 'User' ? (
                                            
                                            <Button variant="primary" onClick={() => { handleEditShow(); updateStatus(i); }}>
                                            <Icon.PencilSquare className='icon' />
                                            </Button>

                                        ) : user?.role === 'Admin' ? (
                                            <div>
                     
                                            
                                            <Button variant="primary" onClick={() => {updateHandleShow();  updateUsersList(i)}} className="end">
                                                <Icon.PencilSquare />
                                            </Button>

                                            <Button variant="danger" onClick={() => { onDeleteTask(i); }}>
                                                <Icon.X />
                                            </Button>
                                            </div>
                                        ) : user?.role === 'TaskCreator' ? (
                                            <div>
                                   

                                            <Button variant="primary" onClick={() => {updateHandleShow();  updateUsersList(i)}} className="end">
                                                <Icon.PencilSquare />
                                            </Button>

                                            <Button variant="danger" onClick={() => { onDeleteTask(i); }}>
                                                <Icon.X />
                                            </Button>
                                            </div>
                                        ) : null
                                    }
                                </td>
                            </tr>
                        ))
                    )
                }
                    
                </tbody>
            </Table>


            <Offcanvas show={updateShow} onHide={updateHandleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className='me-auto'>Update Task</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                <Form onSubmit={updateHandleSubmit}>
                    <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                    <Form.Label className='small mb-1 fw-bold'>Name</Form.Label>
                    <Form.Control type="text" onChange={updateHandleChange} name="title" value={updateFormData.title}/>
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className='small mb-1 fw-bold'>Description</Form.Label>
                    <Form.Control as="textarea" rows={2} onChange={updateHandleChange} name="description" value={updateFormData.description}/>
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="exampleForm.ControlInput2">
                    <Form.Label className='small mb-1 fw-bold'>Project</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={updateHandleChange} name="project" value={updateFormData.project}>
                        <option value='' disabled>Select project</option>
                        {
                        project.map((i) => (
                            <option key={i?.id} value={i?.id}>{i?.name}</option>
                        ))
                        }
                    </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="exampleForm.ControlInput4">
                    <Form.Label className='small mb-1 fw-bold'>Assign To</Form.Label>
                    <Form.Select aria-label="Default select exampl2" onChange={updateHandleChange} name="assigned_to" value={updateFormData.assigned_to}>
                        <option disabled>Select user</option>
                        {
                            userRole.map((i) => (
                                <option key={i?.id} value={i?.id}>{i?.name}</option>
                            ))
                        }
                    </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="exampeForm.ControlInput1">
                    <Form.Label className='small mb-1 fw-bold'>Due Date</Form.Label>
                    <Form.Control type="datetime-local" onChange={updateHandleChange} name="due_date" value={updateFormData?.due_date}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampeForm.ControlInput3">
                    <Form.Label className='small mb-1 fw-bold'>Status</Form.Label>
                    <Form.Select aria-label="Default select exampl1" onChange={updateHandleChange} name="status" value={updateFormData.status}>
                        <option value="" disabled>Select status</option>
                        <option value="Pending">Pending</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Hold">Hold</option>
                        <option value="Completed">Completed</option>
                    </Form.Select>
                    </Form.Group>

                    <div className="mt-auto pt-3 border-top">
                    <Button type="submit" className='modalbtn' variant="primary">
                        Submit
                    </Button>
                    </div>
                </Form>
                </Offcanvas.Body>
            </Offcanvas>


            <Modal show={editShow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {taskModal?.title}
                        
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div ><small><b>Description : </b></small></div>
                    <div>
                    <small>{taskModal?.description}</small></div>
                        
                    </div>
                    <Form onSubmit={handleSubmit} >
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label className='mt-2'><small><b>Status : </b></small></Form.Label>
                            <Form.Select name="status" className='mb-3' onChange={handleChange} aria-label="Default select example">
                                {
                                    status.map((val, idx) => (
                                        <option key={val} value={val}>{val}</option>
                                    ))
                                }
                            </Form.Select>
                            <Button type="submit" className='modalBtns' variant="primary">
                                Submit
                            </Button>
                            <Button variant="secondary" className='modalBtns' onClick={handleEditClose}>
                                Close
                            </Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>



        </div>
    )
}[]