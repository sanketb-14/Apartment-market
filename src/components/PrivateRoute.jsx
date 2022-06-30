import React from 'react'
import {Navigate,Outlet} from 'react-router-dom'
import {useAuthStatus} from '../hooks/useAuthStatus'


function PrivateRoute() {
    const {loggedIn,checkingStatus} = useAuthStatus()
    if(checkingStatus){
        return (
            <div className="btn-block btn-glass">
                <div className="btn-loading">Loading....</div>
            </div>
        )
    }
  return loggedIn ? <Outlet /> : <Navigate to='/sign-in'/>
}

export default PrivateRoute