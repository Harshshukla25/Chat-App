 import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    conversations: {}, // { userId: [messages] }
  },
  reducers: {
    setMessages: (state, action) => {
      const { userId, messages } = action.payload;
      state.conversations[userId] = messages;
    },
    addMessage: (state, action) => {
      const { userId, message } = action.payload;
      if (!state.conversations[userId]) {
        state.conversations[userId] = [];
      }
      state.conversations[userId].push(message);
    },
  },
});

export const { setMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
