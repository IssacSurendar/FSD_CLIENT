import {  Link } from 'react-router-dom';
import {Table, Button, Modal} from 'react-bootstrap'
import CustomCanvas from '../../components/OffCanvasEnd/User/User'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import authService from '../../features/auth/authService'
import { fetchUserData } from '../../features/user/userSlice';
import * as Icon from 'react-bootstrap-icons';
import userService from '../../features/user/userService';
import { UserRole } from '../../utils/constants';
import Form from 'react-bootstrap/Form';

export default function User(){

    const [users, setUsers] = useState([])
    const dispatch = useDispatch();

    const [editShow, setEdiShow] = useState(false);
    const handleEditClose = () => setEdiShow(false);
    const handleEditShow = () => setEdiShow(true);
    const [userModal, setUserModal] = useState({});
    console.log("User", userModal)
    const [role, setUserRole] = useState([])

    const {user} = useSelector((state) => state.auth)

    const getUsers = async() => {
        const response = await dispatch(fetchUserData()).unwrap()
        if (response?.result){
            // console.log(response?.result)
            setUsers(response.result)
        }
    }

    useEffect(() => {
        getUsers()
        if(user?.role != 'Admin'){
            navigate('/access-denied')
        }
        console.log(userModal)
    }, [])

    async function deleteUserById(id){
        const checkPrompt = window.prompt("Type DELETE to confirm");
        if (checkPrompt == 'DELETE'){
            const payload = {
                "id": id.toString()
            }
            const response = await userService.deleteUser(payload)
            if (response){
                getUsers()
                alert(response?.message)
            }
        }
    }


    async function handleSubmit(e){
        e.preventDefault()
        // console.log(userModal)
        const formData = {
            'username': userModal?.user__username,
            'email': userModal?.user__email,
            'role': userModal?.role,
            'id': userModal?.user__id
        }
        console.log(formData)
        userService.updateUser(formData)
        getUsers()
        handleEditClose()
    }

    function updateStatus(i){
        setUserModal(i)
        UserRole.splice(0, 0, i?.role);
        setUserRole([...new Set(UserRole)])
    }

    function handleChanges(e){
        // console.log(e.target)
        const {name, value} = e.target
        // console.log(name, value)
        setUserModal((prev) => ({
            ...prev,
            [name]: value
        }))
        // console.log(userModal)
    }




    return (
        <div>
            <div>
                <span className='mb-3'><b>USERS</b></span>
                <CustomCanvas className="float-end" position='end' title='Add User' onSubmit={getUsers}/>
            </div>

            <Table striped bordered hover size="sm" className='mt-3'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        
                            users.length === 0 ? (
                                <tr>
                                    <td key="1" colSpan="7"> No task found.</td>
                                </tr>
                            ) 
                        
                        :
                        (
                            users.map((i) => 
                                (
                                    <tr className='small'>
                                        <td>{'#'+i?.id}</td>
                                        <td>
                                        {
                                        i?.picture != '' ? (
                                            <img className='pic' width='25px' src={i?.picture}/>
                                        ) : (
                                            <span className='txtImg'>{i?.user__username[0]}</span>
                                        )
                                    }
                                    <span className='picOwner'>{i?.user__username}</span>
                                     
                                        </td>
                                        <td className='tt'>{i?.user__email}</td>
                                        <td>{i?.role}</td>
                                        <td>
                                            <Button variant="primary" onClick={() => {handleEditShow(); updateStatus(i); }}>
                                                <Icon.PencilSquare />
                                            </Button>
                                            <Button variant="danger" onClick={() => {deleteUserById(i?.user__id);}}>
                                                <Icon.X />
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            )
                        )
                    }

                </tbody>
            </Table>


            <Modal show={editShow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='me-auto'>
                        Edit User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} >
                        <Form.Group className="mb-3" controlId="userForm1.ControlInp2">
                            <Form.Label className='small mb-1 fw-bold'>Name</Form.Label>
                            <Form.Control type="text" name="user__username" required onChange={handleChanges} value={userModal?.user__username} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="userForm1.ControlInp3">
                            <Form.Label className='small mb-1 fw-bold'>Email</Form.Label>
                            <Form.Control type="email" name="user__email" required onChange={handleChanges} value={userModal?.user__email} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="userForm1.ControlInp4">
                            <Form.Label className='small mb-1 fw-bold'>Role</Form.Label>
                            <Form.Select name="role" onChange={handleChanges} aria-label="Default select example">
                                {
                                    role.map((val, idx) => (
                                        <option value={val}>{val}</option>
                                    ))
                                }
                            </Form.Select>
                        </Form.Group>
                        <Button type="submit" className='mb-2 modalbtn' variant="primary">
                            Submit
                        </Button>
                    </Form> 
                </Modal.Body>
            </Modal>


        </div>
    )
}