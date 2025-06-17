import { useDispatch } from "react-redux"
import { logout } from "../../features/auth/authSlice"

export default function Logout(){

    const dispatch = useDispatch();
    try{
        localStorage.clear()
        dispatch(logout())
    }catch(error){
        console.log("error", error)
    }


    return (
        <div>
            <div>Logged out successfully</div>
        </div>
    )
}