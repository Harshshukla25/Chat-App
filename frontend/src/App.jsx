import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import getCurrentUser from './customHooks/getCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import Profile from './pages/Profile'
import getOtherUsers from './customHooks/getOtherUsers'
import {io} from "socket.io-client"
import { setOnlineUsers, setSocket } from './redux/userSlice.js'

const App = () => {
  getCurrentUser();
  getOtherUsers ();
  const {userData,socket,onlineUsers}=useSelector(state=>state.user)
  const dispatch=useDispatch()
  const { darkMode } = useSelector((state) => state.ui);

useEffect(()=>{
  if(userData){
      const socketio=io("https://chat-app-0fpq.onrender.com",{
        withCredentials:true,
    query:{
      userId:userData?._id
    }
  })
  dispatch(setSocket(socketio))
  socketio.on("getOnlineUsers",(users)=>{
    dispatch(setOnlineUsers(users))
  })

  return ()=>socketio.close()

  }else{
    if(socket){
      socket.close()
      dispatch(setSocket(null))
    }
  }
  
  
},[userData])


  return (
    
    <Routes>
      <Route path='/login' element={!userData?<Login/>:<Navigate to="/"/>}/>
      <Route path='/signup' element={!userData?<SignUp/>:<Navigate to="/profile"/>}/>
      <Route path='/' element={userData?<Home/>:<Navigate to="/login"/>}/>
      <Route path='/profile' element={userData?<Profile/>:<Navigate to="/signup"/>}/>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
    
  )
}

export default App
