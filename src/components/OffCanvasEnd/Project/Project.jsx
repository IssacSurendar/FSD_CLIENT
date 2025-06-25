import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import projectService from '../../../features/project/projectService'
import getProject from '../../../pages/Project/Project'
import * as Icon from 'react-bootstrap-icons';
import { Alert } from 'react-bootstrap';



function OffCanvasExample({ name, onSubmit, ...props }) {
    const dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [apiMessageShow, setApiMessageShow] = useState(false);

    const intialFormData = {
      name: '',
      description: '',
      status: ''
    }
    const [formData, setFormData] = useState(intialFormData)

    function handleChange(e){
      const {name, value} = e.target
      setFormData((prev) => ({
          ...prev,
          [name]: value
      }))
    }

    async function handleSubmit(e){
      e.preventDefault()
      console.log(formData)
      const response = await projectService.createProject(formData)
      if(response){
        setFormData(intialFormData)
        handleClose()
        onSubmit();
        setApiMessageShow(true);
      }else{
        alert(response?.message)
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
        <Button variant="primary" onClick={handleShow} className={props.class+ ' cubtn'}>
          <Icon.PlusLg></Icon.PlusLg>&nbsp;{name}
        </Button>

        {apiMessageShow && (
                <Alert className='p-2 m-0 mt-2' variant="success" dismissible onClose={() => setApiMessageShow(false)}>
                    <small>Project created successfully.</small>
                </Alert>
        )}

        <Offcanvas show={show} onHide={handleClose} {...props}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className='me-auto'>Create Project</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label className='small mb-1 fw-bold'>Name</Form.Label>
              <Form.Control type="text" onChange={handleChange} name="name" value={formData.name}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label className='small mb-1 fw-bold'>Description</Form.Label>
              <Form.Control as="textarea" rows={3} onChange={handleChange} name="description" value={formData.description}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label className='small mb-1 fw-bold'>Status</Form.Label>
              <Form.Select aria-label="Default select example" required onChange={handleChange} name="status" value={formData.status}>
                <option value="" >Select project status</option>
                <option value="Open">Open</option>
                <option value="InProgress">In Progress</option>
                <option value="Hold">Hold</option>
                <option value="Completed">Completed</option>
                <option value="Closed">Closed</option>
              </Form.Select>
            </Form.Group>

            <div className="mt-auto pt-3 border-top">
              {/* Footer area */}
              <Button variant="primary" className='modalbtn' type="submit">
                Submit
              </Button>
            </div>
          </Form>
          </Offcanvas.Body>

        </Offcanvas>
      </>
    );
}

function CreateProjectCanvas({position, title, className, onSubmit}) {
    return (
      <>
        {[position].map((placement, idx) => (
          <OffCanvasExample key={idx} class={className} placement={placement} name={title} onSubmit={onSubmit} />
        ))}
      </>
    );
}

export default CreateProjectCanvas