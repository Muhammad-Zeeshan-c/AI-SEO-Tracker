import { Outlet,Navigate } from "react-router-dom";
import {useApp} from '../context/appContext.tsx'

export default function ProtectedRoute() {
    const {token,loading }=useApp()

    if (loading) {
        return (
        <div className='min-h-screen flex justify-center items-center bg-dark-900'>
            {/*Loader*/}
            <div className='w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin'> Loading... </div>
        </div>);
    }

    if(!token) {
        return <Navigate to='/login' replace/>
    }
    return <Outlet />;
}
