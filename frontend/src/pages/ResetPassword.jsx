import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main";
import hidden from "../assets/hidden.png"
import show from "../assets/show.png"

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams(); 
  const [newPasswordShow,setNewPasswordShow]=useState(false)
  const [resetPasswordShow,setResetPasswordShow]=useState(false)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`${serverUrl}/api/auth/reset-password/${token}`, {
        password,
      });

      setMessage(res.data.message);
      setError("");

      // Redirect to login after 2s
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex items-center justify-center">
      <div className="w-full max-w-[425px] h-auto py-[30px] bg-white rounded-lg shadow-lg flex flex-col gap-[20px] items-center">
        <h2 className="text-2xl font-bold text-[#3032bb]">Reset Password</h2>
        <form onSubmit={handleResetPassword} className="w-[90%] flex flex-col gap-[20px]">
            <div className="w-[90%] h-[50px]  border-2 border-[#3032bb] overflow-hidden rounded-lg shadow-gray-200 shadow-lg relative">
          <input
            type={`${newPasswordShow?"text":"password"}`}
            placeholder="New Password"
            className="w-full h-full outline-none px-[17px] py-[8px] bg-[white] text-gray-800 text-[15px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className='absolute top-[15px] right-[20px] text-[17px]' onClick={()=>setNewPasswordShow(prev=>!prev)}>
                  <img src={newPasswordShow ? hidden : show}  className='w-[20px] cursor-pointer'  />
                  </span>
                  </div>

          <div  className="w-[90%] h-[50px]  border-2 border-[#3032bb] overflow-hidden rounded-lg shadow-gray-200 shadow-lg relative">
            <input
            type={`${resetPasswordShow?"text":"password"}`}
            placeholder="Confirm Password"
            className="w-full h-full outline-none px-[17px] py-[8px] bg-[white] text-gray-800 text-[15px]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span className='absolute top-[15px] right-[20px] text-[17px]' onClick={()=>setResetPasswordShow(prev=>!prev)}>
                  <img src={resetPasswordShow ? hidden : show}  className='w-[20px] cursor-pointer'  />
                  </span>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          <button
            type="submit"
            className="w-full bg-[#3032bb] text-white font-semibold py-[10px] cursor-pointer rounded-lg hover:bg-[#2022aa]"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
