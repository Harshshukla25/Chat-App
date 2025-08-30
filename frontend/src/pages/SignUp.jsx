import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import hidden from "../assets/hidden.png"
import show from "../assets/show.png"
import axios from "axios"
import { serverUrl } from '../main'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const SignUp = () => {
    const navigate=useNavigate()
    const [passwordShow,setPasswordShow]=useState(false)
    const [userName,setUserName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [loading,setLoading]=useState(false)
    const [err,setErr]=useState("")
    const dispatch=useDispatch()
    

    const handleSignup=async (e)=>{
      e.preventDefault()
      setLoading(true)
      try {
        const result=await axios.post(`${serverUrl}/api/auth/signup`,{
userName,email,password
        },{withCredentials:true})
        dispatch(setUserData(result.data))
        navigate("/profile")
        setUserName("")
        setEmail("")
        setPassword("")
        setLoading(false)
        setErr("")
      } catch (error) {
        console.log(error)
        setLoading(false)
        setErr(error?.response?.data?.message)
      }
    }


  return (
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center'>
      <div className='w-full max-w-[450px] h-[580px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]'>
        <div className='w-full h-[200px] bg-[#3032bb] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col items-center justify-center'>
<h1 className='text-black  font-bold text-[40px]'>Welcome to <span className='text-white'>ChatChit</span></h1>
<p className="text-gray-200 mt-2 text-md">
            Create your account to get connected
          </p>

        </div>
<form className='w-full flex items-center flex-col gap-[20px]' onSubmit={handleSignup}>
      <input type="text" placeholder='username' className='w-[90%] h-[50px] outline-none border-2 border-[#3032bb] px-[17px] py-[8px] bg-[white] rounded-lg shadow-gray-200 shadow-lg  text-gray-800 text-[15px]' onChange={(e)=>setUserName(e.target.value)} value={userName} />
      <input type="email" placeholder='email' className='w-[90%] h-[50px] outline-none border-2 border-[#3032bb] px-[17px] py-[8px] bg-[white] rounded-lg shadow-gray-200 shadow-lg  text-gray-800 text-[15px]'  onChange={(e)=>setEmail(e.target.value)} value={email}/>
      <div className='w-[90%] h-[50px]  border-2 border-[#3032bb] overflow-hidden rounded-lg shadow-gray-200 shadow-lg relative'>
        <input type={`${passwordShow?"text":"password"}`} placeholder='password' className='w-full h-full outline-none px-[17px] py-[8px] bg-[white] text-gray-800 text-[15px]'  onChange={(e)=>setPassword(e.target.value)} value={password}/>
        <span className='absolute top-[15px] right-[20px] text-[17px]' onClick={()=>setPasswordShow(prev=>!prev)}>
        <img src={passwordShow ? hidden : show} alt="" className='w-[20px] cursor-pointer'  />
        </span>
      </div>
      
{err && <p className='text-red-500 text-sm ml-2 '>{err}</p>}
      <button className="w-[200px] px-[20px] py-[5px] mt-[10px] bg-[#3032bb] rounded-2xl shadow-gray-400 shadow-lg text-[20px] text-[white] font-semibold cursor-pointer hover:shadow-inner" disabled={loading} >{loading?"Loading...":"SignUp"}</button>
      <p className='text-[16px]'>Already Have an Account ? <span className='text-[#3032bb] font-semibold cursor-pointer' onClick={()=>navigate("/login")}>Login</span></p>
</form>
      </div>
    </div>
  )
}

export default SignUp








// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import hidden from "../assets/hidden.png";
// import show from "../assets/show.png";

// const SignUp = () => {
//   const navigate = useNavigate();
//   const [passwordShow, setPasswordShow] = useState(false);

//   return (
//     <div className="w-full h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121c] to-[#0a0a0f] flex items-center justify-center px-4">
//       {/* Form Card */}
//       <div className="w-full max-w-[420px] bg-[#1c1c27] rounded-2xl shadow-2xl p-8 flex flex-col gap-6 text-white border border-white/10">
        
//         {/* Header */}
//         <div className="text-center">
//           <h1 className="text-3xl font-bold tracking-wide">
//             Welcome to <span className="text-[#7e1fcc]">ChatChit</span>
//           </h1>
//           <p className="text-gray-400 mt-2 text-sm">
//             Create your account to get started
//           </p>
//         </div>

//         {/* Form */}
//         <form className="flex flex-col gap-5">
//           <input
//             type="text"
//             placeholder="Username"
//             className="w-full h-[48px] rounded-lg px-4 bg-[#2a2a38] text-white placeholder-gray-400 outline-none border border-transparent focus:border-[#7e1fcc] transition"
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full h-[48px] rounded-lg px-4 bg-[#2a2a38] text-white placeholder-gray-400 outline-none border border-transparent focus:border-[#7e1fcc] transition"
//           />
//           <div className="w-full h-[48px] flex items-center rounded-lg px-4 bg-[#2a2a38] text-white border border-transparent focus-within:border-[#7e1fcc] relative">
//             <input
//               type={passwordShow ? "text" : "password"}
//               placeholder="Password"
//               className="w-full bg-transparent outline-none placeholder-gray-400"
//             />
//             <img
//               src={passwordShow ? hidden : show}
//               alt=""
//               className="w-5 absolute right-4 cursor-pointer opacity-70 hover:opacity-100 transition"
//               onClick={() => setPasswordShow((prev) => !prev)}
//             />
//           </div>

//           {/* Button */}
//           <button
//             type="button"
//             className="w-full h-[48px] bg-gradient-to-r from-[#7e1fcc] to-[#4a00e0] rounded-lg text-lg font-medium hover:opacity-90 transition"
//           >
//             Sign Up
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="text-center text-gray-400 text-sm">
//           Already have an account?{" "}
//           <span
//             className="text-[#7e1fcc] font-semibold cursor-pointer hover:underline"
//             onClick={() => navigate("/login")}
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignUp;








