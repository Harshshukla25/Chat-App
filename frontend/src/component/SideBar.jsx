
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import default_dp from "../assets/defaultDp.webp";
// import { IoSearchOutline } from "react-icons/io5";
// import { RxCross2 } from "react-icons/rx";
// import useGetOtherUsers from "../customHooks/getOtherUsers";
// import { RiLogoutCircleLine } from "react-icons/ri";
// import { serverUrl } from "../main";
// import axios from "axios";
// import {
//   setOtherUsers,
//   setSearchData,
//   setSelectedUser,
//   setUserData,
// } from "../redux/userSlice";
// import { setMessages } from "../redux/messageSlice"; // ✅ added
// import { useNavigate } from "react-router-dom";
// import { BsRobot } from "react-icons/bs";

// const SideBar = () => {
//   const { userData, selectedUser, onlineUsers, searchData } = useSelector(
//     (state) => state.user
//   );
//   const otherUsers = useGetOtherUsers();
//   let [search, setSearch] = useState(false);
//   const [input, setInput] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // ✅ Logout
//   const handleLogout = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, {
//         withCredentials: true,
//       });
//       dispatch(setUserData(null));
//       dispatch(setOtherUsers(null));
//       navigate("/login");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ✅ Search users
//   const handleSearch = async () => {
//     try {
//       const result = await axios.get(
//         `${serverUrl}/api/user/search?query=${input}`,
//         { withCredentials: true }
//       );
//       const filtered = result.data.filter((u) => u._id !== userData._id);
//       dispatch(setSearchData(filtered));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (input) {
//       handleSearch();
//     } else {
//       dispatch(setSearchData([]));
//     }
//   }, [input]);

//   // ✅ Select AI Assistant
//   const handleSelectAI = () => {
//     const aiUser = {
//       _id: "ai_bot",
//       name: "AI Assistant",
//       image: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
//     };
//     dispatch(setSelectedUser(aiUser));
//     dispatch(setMessages({ userId: aiUser._id, messages: [] }));
//   };

//   // ✅ Select a real user
//   const handleSelectUser = async (user) => {
//     dispatch(setSelectedUser(user));
//     try {
//       const res = await axios.get(`${serverUrl}/api/message/get/${user._id}`, {
//         withCredentials: true,
//       });
//       dispatch(setMessages({ userId: user._id, messages: res.data }));
//     } catch (error) {
//       console.log("Error fetching messages:", error);
//     }
//   };

//   return (
//     <div
//       className={`lg:w-[30%] lg:block w-full h-full bg-slate-200 relative ${
//         !selectedUser ? "block" : "hidden"
//       } `}
//     >
//       {/* Floating Buttons */}


//       {/* Search Results */}
//       {input.length > 0 && (
//         <div className="flex absolute items-center top-[250px] pt-[20px]  bg-[white] w-full h-[100vh] overflow-y-auto flex-col gap-[10px] shadow-lg z-[150]">
//           {searchData?.map((user) => (
//             <div
//               key={user._id}
//               className="w-[95%] h-[60px] flex justify-start px-[10px] items-center gap-[20px]  bg-white border-b-2 border-gray-500  hover:bg-[#c2c2e0] cursor-pointer "
//               onClick={() => {
//                 handleSelectUser(user);
//                 setInput("");
//                 setSearch(false);
//               }}
//             >
//               <div className="relative rounded-full flex  justify-center items-center ">
//                 <div className="w-[45px] h-[45px] rounded-full overflow-hidden flex justify-center items-center">
//                   <img src={user.image || default_dp} alt="" className="h-[100%]" />
//                 </div>
//                 {(user._id === "ai_bot" || onlineUsers?.includes(user._id)) && (
//                   <span className="w-[10px] h-[10px] rounded-full absolute bottom-0 right-0 bg-[#3aff20] shadow-gray-500 shadow-md"></span>
//                 )}
//               </div>

//               <h1 className="text-gray-800 font-semibold text-[18px]">
//                 {user.name || user.userName}
//               </h1>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Top Section */}
//       <div className="w-full h-[300px] bg-[#919bee] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px]">
//         <h1 className="text-white font-bold text-[35px]">ChatChit</h1>

//         <div className="w-full flex justify-between items-center">
//           <h1 className="text-gray-900 font-semibold text-[25px]">
//             Hi, {userData.name || "user"}
//           </h1>
//           <div
//             className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center cursor-pointer"
//             onClick={() => navigate("/profile")}
//           >
//             <img
//               src={userData.image || default_dp}
//               alt=""
//               className="h-[100%] "
//             />
//           </div>
//         </div>

//         {/* Quick online users */}
//         <div className="w-full flex items-center gap-[20px] overflow-y-auto">
//           {!search && (
//             <div
//               className="w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center bg-white  mt-[10px] ring-1 ring-gray-300 items-center cursor-pointer"
//               onClick={() => setSearch(true)}
//             >
//               <IoSearchOutline className="w-[23px] h-[23px]" />
//             </div>
//           )}
//           {search && (
//             <form className="w-full h-[40px] bg-white ring-2 ring-gray-300 flex items-center gap-[10px] mt-[10px] rounded-full overflow-hidden px-[20px] relative">
//               <IoSearchOutline className="w-[28px] h-[28px]" />
//               <input
//                 type="text"
//                 placeholder="search users..."
//                 className="w-full h-full p-[10px] outline-0 border-0"
//                 onChange={(e) => setInput(e.target.value)}
//                 value={input}
//               />
//               <RxCross2
//                 className="w-[28px] h-[28px] cursor-pointer"
//                 onClick={() => setSearch(false)}
//               />
//             </form>
//           )}
//           {!search &&
//             otherUsers?.map(
//               (user) =>
//                 onlineUsers?.includes(user._id) && (
//                   <div
//                     key={user._id}
//                     className="relative rounded-full flex mt-[10px] justify-center items-center  cursor-pointer"
//                     onClick={() => handleSelectUser(user)}
//                   >
//                     <div className="w-[40px] h-[40px]  rounded-full   overflow-hidden flex justify-center items-center">
//                       <img
//                         src={user.image || default_dp}
//                         alt=""
//                         className="h-[100%]"
//                       />
//                     </div>
//                     <span className="w-[10px] h-[10px] rounded-full absolute bottom-0 right-0 bg-[#3aff20] shadow-gray-500 shadow-md"></span>
//                   </div>
//                 )
//             )}
//         </div>
//       </div>

//       {/* All Users */}
//       <div className="w-full h-[50%]  overflow-auto flex flex-col gap-[20px] items-center mt-[20px]">
//         {otherUsers?.map((user) => (
//           <div
//             key={user._id}
//             className="w-[95%] h-[50px] flex justify-start items-center gap-[20px] shadow-gray-500 bg-white shadow-lg rounded-full hover:bg-[#c2c2e0] cursor-pointer "
//             onClick={() => handleSelectUser(user)}
//           >
//             <div className="relative rounded-full flex  justify-center items-center shadow-gray-500 shadow-md">
//               <div className="w-[45px] h-[45px] rounded-full overflow-hidden flex justify-center items-center">
//                 <img src={user.image || default_dp} alt="" className="h-[100%]" />
//               </div>
//               {onlineUsers?.includes(user._id) && (
//                 <span className="w-[10px] h-[10px] rounded-full absolute bottom-0 right-0 bg-[#3aff20] shadow-gray-500 shadow-md"></span>
//               )}
//             </div>

//             <h1 className="text-gray-800 font-semibold text-[18px]">
//               {user.name || user.userName}
//             </h1>
//           </div>
//         ))}
//       </div>


//      {/* Bottom bar inside sidebar */}
// <div className="flex justify-between  items-center px-4 py-2 mt-auto">
//   {/* Logout button - Left */}
//   <div
//     className="w-[40px] h-[40px] rounded-full flex justify-center items-center bg-[#6c6ed3] 
//                shadow-gray-500 shadow-lg cursor-pointer"
//     onClick={handleLogout}
//   >
//     <RiLogoutCircleLine className="w-[22px] h-[22px] text-white" />
//   </div>

//   {/* AI button - Right */}
//   <div
//     className="w-[40px] h-[40px] rounded-full flex justify-center items-center bg-green-500 
//                shadow-gray-500 shadow-lg cursor-pointer"
//     onClick={handleSelectAI}
//   >
//     <BsRobot className="w-[22px] h-[22px] text-white" />
//   </div>
// </div>




//     </div>
//   );
// };

// export default SideBar;




import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import default_dp from "../assets/defaultDp.webp";
import { IoSearchOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import useGetOtherUsers from "../customHooks/getOtherUsers";
import { RiLogoutCircleLine } from "react-icons/ri";
import { serverUrl } from "../main";
import axios from "axios";
import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice"; 
import { useNavigate } from "react-router-dom";
import { BsRobot } from "react-icons/bs";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import {useTheme} from "../context/ThemeContext.jsx"

const SideBar = () => {
  const { userData, selectedUser, onlineUsers, searchData } = useSelector(
    (state) => state.user
  );
  const otherUsers = useGetOtherUsers();
  let [search, setSearch] = useState(false);
  const [input, setInput] = useState("");
  const {darkMode, setDarkMode} = useTheme(); // ✅ Dark mode state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${input}`,
        { withCredentials: true }
      );
      const filtered = result.data.filter((u) => u._id !== userData._id);
      dispatch(setSearchData(filtered));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (input) {
      handleSearch();
    } else {
      dispatch(setSearchData([]));
    }
  }, [input]);

  const handleSelectAI = () => {
    const aiUser = {
      _id: "ai_bot",
      name: "AI Assistant",
      image: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
    };
    dispatch(setSelectedUser(aiUser));
    dispatch(setMessages({ userId: aiUser._id, messages: [] }));
  };

  const handleSelectUser = async (user) => {
    dispatch(setSelectedUser(user));
    try {
      const res = await axios.get(`${serverUrl}/api/message/get/${user._id}`, {
        withCredentials: true,
      });
      dispatch(setMessages({ userId: user._id, messages: res.data }));
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  return (
    <div
      className={`lg:w-[30%] lg:block w-full h-full relative transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-slate-200 text-gray-900"
      } ${!selectedUser ? "block" : "hidden"}`}
    >
      {/* Dark mode toggle button */}
      <div className="absolute top-4 right-4 cursor-pointer">
        {darkMode ? (
          <MdOutlineLightMode
            size={28}
            onClick={() => setDarkMode(false)}
            className="text-yellow-400"
          />
        ) : (
          <MdOutlineDarkMode
            size={28}
            onClick={() => setDarkMode(true)}
            className="text-gray-800"
          />
        )}
      </div>

      {/* Search Results */}
      {input.length > 0 && (
        <div
          className={`flex absolute items-center top-[250px] pt-[20px] w-full h-[100vh] overflow-y-auto flex-col gap-[10px] shadow-lg z-[150] ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {searchData?.map((user) => (
            <div
              key={user._id}
              className={`w-[95%] h-[60px] flex justify-start px-[10px] items-center gap-[20px] border-b-2 cursor-pointer ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  : "bg-white hover:bg-[#c2c2e0] text-gray-800 border-gray-500"
              }`}
              onClick={() => {
                handleSelectUser(user);
                setInput("");
                setSearch(false);
              }}
            >
              <div className="relative rounded-full flex justify-center items-center">
                <div className="w-[45px] h-[45px] rounded-full overflow-hidden flex justify-center items-center">
                  <img src={user.image || default_dp} alt="" className="h-[100%]" />
                </div>
                {(user._id === "ai_bot" || onlineUsers?.includes(user._id)) && (
                  <span className="w-[10px] h-[10px] rounded-full absolute bottom-0 right-0 bg-[#3aff20]"></span>
                )}
              </div>
              <h1 className="font-semibold text-[18px]">
                {user.name || user.userName}
              </h1>
            </div>
          ))}
        </div>
      )}

      {/* Top Section */}
      <div
        className={`w-full h-[300px] rounded-b-[30%] shadow-lg flex flex-col justify-center px-[20px] ${
          darkMode ? "bg-blue-800" : "bg-[#919bee]"
        }`}
      >
        <h1 className="text-white font-bold text-[35px]">ChatChit</h1>

        <div className="w-full flex justify-between items-center">
          <h1
            className={`font-semibold text-[25px] ${
              darkMode ? "text-gray-200" : "text-gray-900"
            }`}
          >
            Hi, {userData.name || "user"}
          </h1>
          <div
            className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <img
              src={userData.image || default_dp}
              alt=""
              className="h-[100%]"
            />
          </div>
        </div>

        {/* Quick online users */}
        <div className="w-full flex items-center gap-[20px] overflow-y-auto">
          {!search && (
            <div
              className={`w-[40px] h-[40px] rounded-full flex justify-center mt-[10px] items-center cursor-pointer ${
                darkMode ? "bg-gray-700" : "bg-white ring-1 ring-gray-300"
              }`}
              onClick={() => setSearch(true)}
            >
              <IoSearchOutline className="w-[23px] h-[23px]" />
            </div>
          )}
          {search && (
            <form
              className={`w-full h-[40px] flex items-center gap-[10px] mt-[10px] rounded-full overflow-hidden px-[20px] relative ${
                darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-white ring-2 ring-gray-300"
              }`}
            >
              <IoSearchOutline className="w-[28px] h-[28px]" />
              <input
                type="text"
                placeholder="search users..."
                className={`w-full h-full p-[10px] outline-0 border-0 ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white"
                }`}
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <RxCross2
                className="w-[28px] h-[28px] cursor-pointer"
                onClick={() => setSearch(false)}
              />
            </form>
          )}
{!search &&
             otherUsers?.map(
               (user) =>
                 onlineUsers?.includes(user._id) && (
                   <div
                    key={user._id}
                     className="relative rounded-full flex mt-[10px] justify-center items-center  cursor-pointer"
                     onClick={() => handleSelectUser(user)}
                   >
                     <div className="w-[40px] h-[40px]  rounded-full   overflow-hidden flex justify-center items-center">
                       <img
                         src={user.image || default_dp}
                         alt=""
                         className="h-[100%]"
                       />
                     </div>
                     <span className="w-[10px] h-[10px] rounded-full absolute bottom-0 right-0 bg-[#3aff20] shadow-gray-500 shadow-md"></span>
                   </div>
                 )
         )}


        </div>
      </div>

      {/* All Users */}
      <div className="w-full h-[50%] overflow-auto flex flex-col gap-[20px] items-center mt-[20px]">
        {otherUsers?.map((user) => (
          <div
            key={user._id}
            className={`w-[95%] h-[50px] flex justify-start items-center gap-[20px] shadow-lg rounded-full cursor-pointer ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-white hover:bg-[#c2c2e0] text-gray-800"
            }`}
            onClick={() => handleSelectUser(user)}
          >
            <div className="relative rounded-full flex justify-center items-center">
              <div className="w-[45px] h-[45px] rounded-full overflow-hidden flex justify-center items-center">
                <img src={user.image || default_dp} alt="" className="h-[100%]" />
              </div>
              {onlineUsers?.includes(user._id) && (
                <span className="w-[10px] h-[10px] rounded-full absolute bottom-0 right-0 bg-[#3aff20]"></span>
              )}
            </div>
            <h1 className="font-semibold text-[18px]">
              {user.name || user.userName}
            </h1>
          </div>
        ))}
      </div>

      {/* Bottom bar inside sidebar */}
      <div className="flex justify-between items-center px-4 py-2 mt-auto">
        <div
          className={`w-[40px] h-[40px] rounded-full flex justify-center items-center cursor-pointer ${
            darkMode ? "bg-blue-700" : "bg-[#6c6ed3]"
          }`}
          onClick={handleLogout}
        >
          <RiLogoutCircleLine className="w-[22px] h-[22px] text-white" />
        </div>
        <div
          className="w-[40px] h-[40px] rounded-full flex justify-center items-center bg-green-500 cursor-pointer"
          onClick={handleSelectAI}
        >
          <BsRobot className="w-[22px] h-[22px] text-white" />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
