import './Register.css'
import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { Link } from 'react-router-dom';


export default function Register(){

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })

    function handleChange(e){
        const {name, value} = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    function handleSubmit(e){
        e.preventDefault()
        // setUsername()
        console.log(formData)
    }


    return (
        <div>
            <form onClick={handleSubmit}>
                <label>Username</label>
                <input type="text" name="username" onChange={handleChange} value={formData.username}/>
                <label>Email</label>
                <input type="email" name="email" onChange={handleChange} value={formData.email}/>
                <label>Password</label>
                <input type="password" name="password" onChange={handleChange} value={formData.password} />
                <input type="checkbox"/> Remember me
                <input type="submit" />
            </form>

            <GoogleLogin
                    onSuccess={(credentialResponse) => {
                    const decoded = jwtDecode(credentialResponse.credential);
                    console.log('User Info:', decoded);
                    }}
                    onError={() => {
                    console.log('Login Failed');
                    }}
                />
                

                <div>
                Existing User? 
                <Link to="/login" exact >Login</Link> 
            </div>
        </div>
    )
}