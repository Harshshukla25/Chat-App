import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null,
        otherUsers:[],
        selectedUser:null,
        currentConversationId: null,
        socket:null,
        onlineUsers:null,
        searchData:null
    },
    reducers:{
        setUserData:(state,action)=>{
state.userData=action.payload
        },
        setOtherUsers:(state,action)=>{
            state.otherUsers=action.payload
        },
         setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload;
            state.currentConversationId = null;
        },
        setCurrentConversationId: (state, action) => {
      state.currentConversationId = action.payload;
    },
         setSocket:(state,action)=>{
            state.socket=action.payload
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers=action.payload
        },
        setSearchData:(state,action)=>{
            state.searchData=action.payload
        }
    }
})

export const {setUserData,setOtherUsers,setSelectedUser,setCurrentConversationId,setSocket,setOnlineUsers,setSearchData}=userSlice.actions

export default userSlice.reducer