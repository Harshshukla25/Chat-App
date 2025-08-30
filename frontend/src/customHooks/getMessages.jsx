import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice.js";
import { serverUrl } from "../main.jsx";
import axios from "axios";

const useGetMessages = () => {
  const dispatch = useDispatch();
  const { userData, selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || selectedUser._id === "ai_bot") return; // ⛔ skip AI

      try {
        

        let url = "";

        if (selectedChat.isGroup) {
          // ✅ Fetch group messages
          url = `${serverUrl}/api/group/messages/${selectedUser._id}`;
        } else {
          // ✅ Fetch 1-1 messages
          url = `${serverUrl}/api/message/get/${selectedUser._id}`;
        }

        const result = await axios.get(url, { withCredentials: true });

        dispatch(
          setMessages({
            userId: selectedUser._id,
            messages: result.data,
          })
        );
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser, userData]);
};

export default useGetMessages;



