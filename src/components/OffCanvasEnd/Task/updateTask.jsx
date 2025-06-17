import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import projectService from '../../../features/project/projectService'
import authService from '../../../features/auth/authService';
import taskService from '../../../features/task/taskService';
import * as Icon from 'react-bootstrap-icons';
import userService from '../../../features/user/userService';


function OffCanvasEditTask({ name, task, editItem, onTaskUpdate, ...props }) {

    console.log("Opening", editItem)
    const dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let due_date = editItem?.due_date
    if(due_date){
      due_date = due_date.slice(0,-4)

    }
    // console.log(due_date)

    const intialFormData = {
      title: editItem?.title,
      description: editItem?.description,
      project: editItem?.project__id,
      assigned_to: editItem?.assigned_to__user__id,
      due_date: due_date,
      status: editItem?.status
    }
    console.log('intialFormData',intialFormData)
    const [formData, setFormData] = useState(intialFormData)
    console.log('formData', formData)

    let { user, loading, error } = useSelector((state) => state.auth);
    // console.log("formData", formData)

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
      setFormData(intialFormData)
    }, [task])

    async function handleSubmit(e){
      e.preventDefault()
      formData['owner'] = user?.id
      formData['id']= user?.id
    //   console.log(formData)
      const response = await taskService.updateTask(formData)
      if(response?.result){
        // setFormData(intialFormData)
        await onTaskUpdate()
        handleClose()
      }
    }

    // console.log("curent task", task)
  
    return (
      <>
        <Button variant="primary" onClick={handleShow} className={props.class}>
            <Icon.PencilSquare />
        </Button>
        <Offcanvas show={show} onHide={handleClose} {...props}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Update Task</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" onChange={handleChange} name="title" value={formData.title}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} onChange={handleChange} name="description" value={formData.description}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Project</Form.Label>
              <Form.Select aria-label="Default select example" onChange={handleChange} name="project" value={formData.project}>
                <option value='' disabled>Select project</option>
                {
                  project.map((i) => (
                    <option key={i?.id} value={i?.id}>{i?.name}</option>
                  ))
                }
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
              <Form.Label>Assign To</Form.Label>
              <Form.Select aria-label="Default select exampl2" onChange={handleChange} name="assigned_to" value={formData.assigned_to}>
                <option value=''>Select user</option>
                {
                  userRole.map((i) => (
                    <option key={i?.id} value={i?.id}>{i?.user__username}</option>
                  ))
                }
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampeForm.ControlInput1">
              <Form.Label>Due Date</Form.Label>
              <Form.Control type="datetime-local" onChange={handleChange} name="due_date" value={formData.due_date}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampeForm.ControlInput3">
              <Form.Label>Status</Form.Label>
              <Form.Select aria-label="Default select exampl1" onChange={handleChange} name="status" value={formData.status}>
                <option value="" disabled>Select status</option>
                <option value="Pending">Pending</option>
                <option value="InProgress">In Progress</option>
                <option value="Hold">Hold</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>

            <div className="mt-auto pt-3 border-top">
              <Button type="submit" variant="primary">
                Submit
              </Button>
            </div>
          </Form>
          </Offcanvas.Body>

        </Offcanvas>
      </>
    );
}

function CustomUpdateTaskCanvas({position, className, editItem, onEdit, onUpdateCall}) {
    
    return (
      
      <>
        {
        // console.log('componet', editItem||'')
        [position].map((placement, idx) => (
          <OffCanvasEditTask key={idx} className={className} editItem={editItem} task={onEdit} onTaskUpdate={onUpdateCall} placement={placement}/>
        ))}
      </>
    );
}

export default  CustomUpdateTaskCanvas