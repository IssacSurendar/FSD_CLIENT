import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import projectService from '../../../features/project/projectService'
import authService from '../../../features/auth/authService';
import taskService from '../../../features/task/taskService';
import userService from '../../../features/user/userService';
import * as Icon from 'react-bootstrap-icons';
import { Alert } from 'react-bootstrap';


function OffCanvasExamples({ name, onTaskCreate, ...props }) {
    const dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [apiMessageShow, setApiMessageShow] = useState(false);


    const intialFormData = {
      title: '',
      description: '',
      project: '',
      assigned_to: '',
      due_date: '',
      status: ''
    }
    const [formData, setFormData] = useState(intialFormData)
    const {user} = useSelector((state) => state.auth)


    function handleChange(e){
      const {name, value} = e.target
      setFormData((prev) => ({
          ...prev,
          [name]: value
      }))
    }


    const [project, setProject] = useState([])
    const [userRole, setUserRole] = useState([])

    const fetchProject = async() => {
      const response =  await projectService.getProject()
      if(response?.result){
          setProject(response.result);
      }
    }

    const fetchUser = async() => {
      const response =  await userService.getUser('User')
      if(response?.result){
        setUserRole(response.result);
      }
    }

    useEffect (() => {
      fetchProject()  
      fetchUser()
      console.log(project)
    }, [])

    async function handleSubmit(e){
      e.preventDefault()
      formData['owner'] = user?.user_meta_id
      const response = await taskService.createTask(formData)
      if(response?.result){
        setFormData(intialFormData)
        onTaskCreate()
        handleClose()
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
      <>
        <Button variant="primary" onClick={handleShow} className={props.class + ' cbtn'}>
          <Icon.PlusLg></Icon.PlusLg>&nbsp;Create Task
        </Button>
        {apiMessageShow && (
                <Alert className='p-2 m-0 mt-2' variant="success" dismissible onClose={() => setApiMessageShow(false)}>
                    <small>Task created successfully.</small>
                </Alert>
            )}
        <Offcanvas show={show} onHide={handleClose} {...props}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className='me-auto'>Create Task</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className=''>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
              <Form.Label className='small mb-1 fw-bold'>Name</Form.Label>
              <Form.Control type="text" required onChange={handleChange} name="title" value={formData.title}/>
            </Form.Group>
            <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
              <Form.Label className='small mb-1 fw-bold'>Description</Form.Label>
              <Form.Control as="textarea" required rows={2} onChange={handleChange} name="description" value={formData.description}/>
            </Form.Group>
            <Form.Group className="mb-2" controlId="exampleForm.ControlInput2">
              <Form.Label className='small mb-1 fw-bold'>Project</Form.Label>
              <Form.Select aria-label="Default select example" required onChange={handleChange} name="project" value={formData.project}>
                <option value='' disabled>Select project</option>
                {
                  project.map((i) => (
                    <option  key={i?.id}  value={i?.id}>{i?.name}</option>
                  ))
                }
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2" controlId="exampleForm.ControlInput4">
              <Form.Label className='small mb-1 fw-bold'>Assign To</Form.Label>
              <Form.Select aria-label="Default select exampl2" required onChange={handleChange} name="assigned_to" value={formData.assigned_to}>
                <option value=''>Select user</option>
                {
                  userRole.map((i) => (
                    <option key={i?.id}  value={i?.id}>{i?.user__username}</option>
                  ))
                }
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
              <Form.Label className='small mb-1 fw-bold'>Due Date</Form.Label>
              <Form.Control type="datetime-local" required onChange={handleChange} name="due_date" value={formData.due_date}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label className='small mb-1 fw-bold'>Status</Form.Label>
              <Form.Select aria-label="Default select exampl1" required onChange={handleChange} name="status" value={formData.status}>
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
      </>
    );
}

function CustomTaskCanvas({position, title, className, onTaskSubmit}) {
    return (
      <>
        {[position].map((placement, idx) => (
          <OffCanvasExamples key={idx} className={className} onTaskCreate={onTaskSubmit} placement={placement} name={title} />
        ))}
      </>
    );
}

export default  CustomTaskCanvas