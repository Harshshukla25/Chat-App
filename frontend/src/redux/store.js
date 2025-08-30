import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice.js"
import messageSlice from "./messageSlice.js"
import uiReducer from "./uiSlice.js"

export const store=configureStore({
   reducer:{
    user:userSlice,
    message:messageSlice,
    ui: uiReducer,
   }
}) 