import './Login.css'
import { useState, useEffect } from 'react'
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { loginUser, logout, setCredentials } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/logo.png'

export default function Login(){


    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate();

    const dispatch = useDispatch();
    let { user, loading, error } = useSelector((state) => state.auth);

    const token = localStorage.getItem('token');
    

    function handleChange(e){
        const {name, value} = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleSubmit(e){
        e.preventDefault()
        formData['sso'] = false
        const response = await dispatch(loginUser(formData)).unwrap();
        if (response?.message == 'Loggedin successfully'){
            navigate('/')
        }
    }

    useEffect(() => {
        if (token){
            user = jwtDecode(token)
            const temp = {
                'user': user,
                'token':token
            }
            dispatch(setCredentials(temp))
            navigate('/')
        }
    }, [])



    return (
        <div className='cucard box w-25 mt-5 pt-3 mx-auto'>
            <img src={logo} width="85px" alt="df"/>
            <h5 className='fw-bold mt-3'>LOGIN</h5>
            <hr className='mt-1'/>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                    <Form.Label className='fw-bold small'>Email address</Form.Label>
                    <Form.Control type="email" name="email" onChange={handleChange} value={formData.email}/>
                </Form.Group>
                <Form.Group className="mb-2" controlId="exampleForm.ControlInput2">
                    <Form.Label className='fw-bold small'>Password</Form.Label>
                    <Form.Control type="Password" name="password" onChange={handleChange} value={formData.password}/>
                </Form.Group>
                <Button type="submit" className='mb-2 loginBtn' variant="primary">Login</Button>
            </Form>

            <GoogleLogin
                    onSuccess={(credentialResponse) => {
                    const decoded = jwtDecode(credentialResponse.credential);
                    console.log('User Info:', decoded);
                    }}
                    onError={() => {
                    console.log('Login Failed');
                    }}
                />
                

        </div>
    )
}