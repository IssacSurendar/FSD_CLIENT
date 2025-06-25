import './Login.css'
import { useState, useEffect } from 'react'
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { loginUser, logout, setCredentials } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/logo.png'
import authService from '../../features/auth/authService';

export default function Login(){


    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [apiMessage, setApiMessage] = useState('')
    const [apiMessageShow, setApiMessageShow] = useState(false);



    useEffect(() => {
        if (apiMessageShow) {
          const timer = setTimeout(() => {setApiMessageShow(false), setApiMessage('')}, 3000); // 5 seconds
          return () => clearTimeout(timer); // Cleanup on unmount or rerun
        }
    }, [apiMessageShow]);

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
        try{
            const response = await dispatch(loginUser(formData)).unwrap();
            if (response?.message == 'Loggedin successfully'){
                navigate('/')
            }
        }catch{
            setApiMessageShow(true);
            setApiMessage('Invalid credentials')
        }
    }

    async function sso_login(user_info){
        let payload = {
            email: user_info?.email,
            username: user_info?.name,
            picture: user_info?.picture,
            sso: true
        }
        try{
            const response = await dispatch(loginUser(payload)).unwrap();
            if (response?.message == 'Loggedin successfully'){
                navigate('/')
            }
        }catch(error){
            setApiMessageShow(true);
            setApiMessage('Invalid credentials')
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
            {apiMessageShow && (
                <Alert className='p-2 m-0' variant="danger" dismissible onClose={() => setApiMessageShow(false)}>
                    <Alert.Heading className='h5 mb-1 mt-0'>Login Failed</Alert.Heading>
                    <small>{apiMessage}</small>
                </Alert>
            )}
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
                    onSuccess={async (credentialResponse) => {
                    const decoded = jwtDecode(credentialResponse.credential);
                        // console.log('User Info:', decoded);
                        await sso_login(decoded)
                    }}
                    onError={() => {
                    console.log('Login Failed');
                    }}
                />
                

        </div>
    )
}