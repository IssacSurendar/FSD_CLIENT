// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { logout } from '../features/auth/authSlice';
import createAppStore from '../store';
// import createAppStore from "./store";


export function setAUth(currentUser) {

//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     let { user, loading, error } = useSelector((state) => state.auth);
//     // const token = localStorage.getItem('token');

//     useEffect(() => {
//         if (currentUser){
//             // user = jwtDecode(token)
//             const temp = {
//                 'user': currentUser,
//                 'token':currentUser['token']
//             }
//             dispatch(setCredentials(temp))
//             navigate('/')
//         }
//     }, [])


//     return (
//         <div>auth</div>
//     )
}


const checkUserIsLoggedIn = () => {
    // let loggedIn = false
    let user = null;
    const token = localStorage.getItem('token');
    if (token){
        try{
            user = jwtDecode(token)
        }catch(error){
            user = null
        }
    }
    return user
}

export const handleUserLogout = () => {
    const store = createAppStore()
    store.dispatch(logout())
    localStorage.clear()
}

export default checkUserIsLoggedIn;