import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import hidden from "../assets/hidden.png"
import show from "../assets/show.png"
import axios from 'axios'
import { serverUrl } from '../main'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const Login = () => {
 const navigate=useNavigate()
    const [passwordShow,setPasswordShow]=useState(false)
     const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [err,setErr]=useState("")
    const dispatch=useDispatch()
    
    
    const handleLogin=async (e)=>{
      e.preventDefault()
      try {
        const result=await axios.post(`${serverUrl}/api/auth/login`,{
       email,password
        },{withCredentials:true})
        dispatch(setUserData(result.data))
        navigate("/")
        setEmail("")
        setPassword("")
        setErr("")
      } catch (error) {
        console.log(error)
       setErr(error?.response?.data?.message)
      }
    }


  return (
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center'>
      <div className='w-full max-w-[425px] h-[525px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]'>
        <div className='w-full h-[200px] bg-[#3032bb] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col items-center justify-center'>
<h1 className='text-black-200  font-bold  text-[40px]'>Login to <span className='text-white '>ChatChit</span></h1>
<p className="text-gray-200 text-md mt-2">
 Connect with your friends and keep chatting
</p>
        </div>
<form onSubmit={handleLogin} className='w-full flex items-center flex-col gap-[20px]'>
      <input type="email" placeholder='email' className='w-[90%] h-[50px] outline-none border-2 border-[#3032bb] px-[17px] py-[8px] bg-[white] rounded-lg shadow-gray-200 shadow-lg  text-gray-800 text-[15px]' onChange={(e)=>setEmail(e.target.value)} value={email}/>
      <div className='w-[90%] h-[50px]  border-2 border-[#3032bb] overflow-hidden rounded-lg shadow-gray-200 shadow-lg relative'>
        <input type={`${passwordShow?"text":"password"}`} placeholder='password' className='w-full h-full outline-none px-[17px] py-[8px] bg-[white] text-gray-800 text-[15px]' onChange={(e)=>setPassword(e.target.value)} value={password}/>
        <span className='absolute top-[15px] right-[20px] text-[17px]' onClick={()=>setPasswordShow(prev=>!prev)}>
        <img src={passwordShow ? hidden : show} alt="" className='w-[20px] cursor-pointer'  />
        </span>
      </div>
       <p 
  className="text-sm text-[#3032bb] cursor-pointer mt-2"
  onClick={() => navigate("/forgot-password")}
>
  Forgot Password?
</p>
      
{err && <p className='text-red-500'>{err}</p>}
      <button className="w-[200px] px-[20px] py-[5px] mt-[10px] bg-[#3032bb] rounded-2xl shadow-gray-400 shadow-lg text-[20px] text-[white] font-semibold cursor-pointer hover:shadow-inner">Login</button>
      <p className='text-[16px]'>Don’t have an account? <span className='text-[#3032bb] font-semibold cursor-pointer' onClick={()=>navigate("/signup")}>Sign up</span></p>
</form>
      </div>
    </div>
  )
}

export default Login
