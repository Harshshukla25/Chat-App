import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../main";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${serverUrl}/api/auth/forgot-password`, { email });
      setMsg(res.data.message);
      setErr("");
    } catch (error) {
      setErr(error?.response?.data?.message || "Something went wrong");
      setMsg("");
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex items-center justify-center">
      <div className="w-full max-w-[425px] h-[400px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px] p-6">
        <h1 className="text-[28px] font-bold text-center text-[#3032bb]">Forgot Password</h1>
        <p className="text-gray-600 text-center text-sm">
          Enter your email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] items-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-[90%] h-[50px] outline-none border-2 border-[#3032bb] px-[17px] py-[8px] rounded-lg shadow-gray-200 shadow-lg text-gray-800 text-[15px]"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          {msg && <p className="text-green-600 text-sm">{msg}</p>}
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button
            type="submit"
            className="w-[200px] px-[20px] py-[10px] mt-[10px] bg-[#3032bb] rounded-2xl shadow-gray-400 shadow-lg text-[18px] text-white font-semibold cursor-pointer hover:shadow-inner"
          >
            Send Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
