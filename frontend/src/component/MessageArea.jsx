import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import default_dp from "../assets/defaultDp.webp";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { GrEmoji } from "react-icons/gr";
import { MdAttachFile } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages, addMessage } from "../redux/messageSlice.js";
import {
  FaFileImage,
  FaVideo,
  FaFileAlt,
  FaMicrophone,
  FaTimes,
} from "react-icons/fa";
import ProfileSlidebar from "./ProfileSidebar.jsx";
import moment from "moment";
import { useTheme } from "../context/ThemeContext";

const SCROLL_STICKY_THRESHOLD_PX = 120;

const MessageArea = () => {
  const dispatch = useDispatch();
  const { selectedUser, userData, socket, onlineUsers } = useSelector(
    (state) => state.user
  );
  const { darkMode } = useTheme();

  // Select only the messages for the currently selected conversation
  const messages = useSelector(
    (state) => state.message.conversations[selectedUser?._id] || []
  );

  // UI state
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [input, setInput] = useState("");

  // Attachment state
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [frontendVideo, setFrontendVideo] = useState(null);
  const [backendVideo, setBackendVideo] = useState(null);
  const [frontendAudio, setFrontendAudio] = useState(null);
  const [backendAudio, setBackendAudio] = useState(null);
  const [frontendFileName, setFrontendFileName] = useState(null);
  const [backendFile, setBackendFile] = useState(null);
  const [fullscreenMedia, setFullscreenMedia] = useState(null);

  // Refs
  const image = useRef();
  const video = useRef();
  const file = useRef();
  const audio = useRef();
  const messagesContainerRef = useRef(null);
  const bottomRef = useRef(null);

  // Sticky scroll helpers
  const isAtBottomRef = useRef(true);
  const isNearBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return true;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distance <= SCROLL_STICKY_THRESHOLD_PX;
  };
  const jumpToBottom = (behavior = "auto") => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      isAtBottomRef.current = isNearBottom();
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    if (selectedUser) {
      requestAnimationFrame(() => jumpToBottom("auto"));
    }
  }, [selectedUser]);

  useLayoutEffect(() => {
    if (isAtBottomRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => jumpToBottom("smooth"));
      });
    }
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const media = container.querySelectorAll("img, video");
    const handleLoaded = () => {
      if (isAtBottomRef.current) jumpToBottom("auto");
    };

    media.forEach((m) => {
      if ("complete" in m && m.complete !== true) {
        m.addEventListener("load", handleLoaded);
        m.addEventListener("error", handleLoaded);
      }
      m.addEventListener("loadedmetadata", handleLoaded);
      m.addEventListener("loadeddata", handleLoaded);
    });

    return () => {
      media.forEach((m) => {
        m.removeEventListener("load", handleLoaded);
        m.removeEventListener("error", handleLoaded);
        m.removeEventListener("loadedmetadata", handleLoaded);
        m.removeEventListener("loadeddata", handleLoaded);
      });
    };
  }, [messages]);

  // -------- Attachments handlers --------
  const handleImage = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setBackendImage(f);
    setFrontendImage(URL.createObjectURL(f));
    setShowAttachmentMenu(false);
  };
  const handleVideo = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setBackendVideo(f);
    setFrontendVideo(URL.createObjectURL(f));
    setShowAttachmentMenu(false);
  };
  const handleAudio = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setBackendAudio(f);
    setFrontendAudio(URL.createObjectURL(f));
    setShowAttachmentMenu(false);
  };
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setBackendFile(f);
    setFrontendFileName(f.name);
    setShowAttachmentMenu(false);
  };

  // -------- Fetch messages --------
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || selectedUser._id === "ai_bot") return;
      try {
        const res = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          { withCredentials: true }
        );
        dispatch(
          setMessages({ userId: selectedUser._id, messages: res.data || [] })
        );
        requestAnimationFrame(() => jumpToBottom("auto"));
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedUser, dispatch]);

  // -------- Socket listener --------
  useEffect(() => {
    if (!socket) return;
    const handler = (mess) => {
      const otherUserId =
        mess.sender === userData._id
          ? mess.receiver || selectedUser?._id
          : mess.sender;

      dispatch(addMessage({ userId: otherUserId, message: mess }));
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [socket, dispatch, userData._id, selectedUser?._id]);

  // -------- Send message --------
  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    const hasAttachment =
      backendImage || backendVideo || backendAudio || backendFile;

    if (!trimmedInput && !hasAttachment) return;

    // AI assistant
    if (selectedUser._id === "ai_bot") {
      if (!trimmedInput) return;
      const myMsg = {
        _id: Date.now(),
        sender: userData._id,
        message: trimmedInput,
        createdAt: new Date().toISOString(),
      };
      dispatch(addMessage({ userId: "ai_bot", message: myMsg }));
      setInput("");

      try {
        const res = await axios.post(
          `${serverUrl}/api/message/chat-ai`,
          { message: trimmedInput },
          { withCredentials: true }
        );
        const aiMsg = {
          _id: Date.now() + 1,
          sender: "ai_bot",
          message: res?.data?.reply ?? "",
          createdAt: new Date().toISOString(),
        };
        dispatch(addMessage({ userId: "ai_bot", message: aiMsg }));
      } catch (err) {
        console.error("AI Error:", err);
      }
      return;
    }

    // Normal user
    try {
      const formData = new FormData();
      if (trimmedInput) formData.append("message", trimmedInput);
      if (backendImage) formData.append("image", backendImage);
      if (backendVideo) formData.append("video", backendVideo);
      if (backendAudio) formData.append("audio", backendAudio);
      if (backendFile) formData.append("file", backendFile);

      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );
      dispatch(addMessage({ userId: selectedUser._id, message: result.data }));

      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
      setFrontendVideo(null);
      setBackendVideo(null);
      setFrontendAudio(null);
      setBackendAudio(null);
      setFrontendFileName(null);
      setBackendFile(null);

      requestAnimationFrame(() => jumpToBottom("smooth"));
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  return (
    <div
      className={`lg:w-[70%] ${
        selectedUser ? "flex" : "hidden"
      } lg:flex w-full h-full border-l-2 border-gray-400 relative transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-slate-200 text-black"
      }`}
    >
      {selectedUser && (
        <div className="w-full h-[100vh] flex flex-col relative">
          {/* Top Bar */}
          <div
            className={`w-full h-[100px] rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center gap-[20px] px-[20px] ${
              darkMode ? "bg-blue-800 shadow-none" : "bg-[#4e5bce] "
            }`}
          >
            <div
              className="cursor-pointer"
              onClick={() => dispatch(setSelectedUser(null))}
            >
              <IoArrowBackSharp className="w-[50px] h-[30px] text-white" />
            </div>
            <div
              className="w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center cursor-pointer"
              onClick={() => setShowProfile(true)}
            >
              <img
                src={selectedUser?.image || default_dp}
                alt=""
                className="h-[100%]"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-white font-semibold text-[20px]">
                {selectedUser?.name || selectedUser?.userName}
              </h1>
              {selectedUser?._id === "ai_bot" ||
              onlineUsers?.includes(selectedUser?._id) ? (
                <span className="text-[13px] text-green-400">Online</span>
              ) : (
                <span className="text-[13px] text-gray-300">Offline</span>
              )}
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="w-full flex-1 min-h-0 flex flex-col py-[20px] px-[20px] pb-[80px] overflow-y-auto"
          >
            {showPicker && (
              <div className="absolute bottom-[80px] left-[20px] z-10">
                <EmojiPicker
                  width={300}
                  height={400}
                  className="shadow-lg"
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}

            {messages?.map((mess, i) => {
              const showDate =
                i === 0 ||
                !moment(messages[i - 1]?.createdAt).isSame(
                  mess.createdAt,
                  "day"
                );

              return (
                // <React.Fragment key={mess?._id || i}>
                //   {showDate && (
                //     <div className="text-center my-2">
                //       <span
                //         className={`text-xs px-3 py-1 rounded-full ${
                //           darkMode
                //             ? "bg-gray-700 text-gray-200 shadow-none"
                //             : "bg-gray-300 text-gray-700"
                //         }`}
                //       >
                //         {moment(mess.createdAt).calendar(null, {
                //           sameDay: "[Today]",
                //           lastDay: "[Yesterday]",
                //           lastWeek: "dddd",
                //           sameElse: "MMM D, YYYY",
                //         })}
                //       </span>
                //     </div>
                //   )}

                //   {mess.sender === userData._id ? (
                //     <SenderMessage {...mess} />
                //   ) : (
                //     <ReceiverMessage {...mess} />
                //   )}
                // </React.Fragment>
                <React.Fragment key={mess?._id || i}>
                  {" "}
                  {showDate && (
                    <div className="text-center my-2">
                      {" "}
                      <span className={`text-xs px-3 py-1 rounded-full
                        ${darkMode?"bg-gray-100 text-gray-800":"bg-gray-300 text-gray-700 "

                        }`}>
                        {" "}
                        {moment(mess.createdAt).calendar(null, {
                          sameDay: "[Today]",
                          lastDay: "[Yesterday]",
                          lastWeek: "dddd",
                          sameElse: "MMM D, YYYY",
                        })}{" "}
                      </span>{" "}
                    </div>
                  )}{" "}
                  {mess.sender === userData._id ? (
                    <SenderMessage
                      image={mess.image}
                      video={mess.video}
                      audio={mess.audio}
                      file={mess.file}
                      fileName={mess.fileName}
                      message={mess.message}
                      createdAt={mess.createdAt}
                    />
                  ) : (
                    <ReceiverMessage
                      image={mess.image}
                      video={mess.video}
                      audio={mess.audio}
                      file={mess.file}
                      fileName={mess.fileName}
                      message={mess.message}
                      createdAt={mess.createdAt}
                    />
                  )}{" "}
                </React.Fragment>
              );
            })}

            <div ref={bottomRef} />
          </div>
        </div>
      )}

      {!selectedUser && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className="font-bold text-[50px]">Welcome to ChatChit</h1>
          <span className="font-semibold text-[20px]">
            Stay Connected with Your Friends !
          </span>
        </div>
      )}

      {selectedUser && (
        <div className="w-full lg:w-[70%] fixed bottom-0 flex flex-col items-center justify-center mb-[25px] px-[20px]">
          {/* Previews */}
          {(frontendImage ||
            frontendVideo ||
            frontendAudio ||
            frontendFileName) && (
            <div className="mb-3 flex flex-col items-center gap-2">
              {frontendImage && (
                <div className="relative">
                  <img
                    src={frontendImage}
                    alt="preview"
                    className="w-[200px] rounded-lg shadow-gray-400 shadow-lg cursor-pointer"
                    onClick={() =>
                      setFullscreenMedia({ type: "image", src: frontendImage })
                    }
                  />
                  <FaTimes
                    size={28}
                    className="absolute top-1 right-1 bg-black text-white rounded-full p-1 cursor-pointer"
                    onClick={() => {
                      setFrontendImage(null);
                      setBackendImage(null);
                    }}
                  />
                </div>
              )}
              {frontendVideo && (
                <div className="relative">
                  <video
                    src={frontendVideo}
                    controls
                    className="w-[200px] rounded-lg shadow-gray-400 shadow-lg cursor-pointer"
                    onClick={() =>
                      setFullscreenMedia({ type: "video", src: frontendVideo })
                    }
                  />
                  <FaTimes
                    size={22}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 cursor-pointer"
                    onClick={() => {
                      setFrontendVideo(null);
                      setBackendVideo(null);
                    }}
                  />
                </div>
              )}
              {frontendAudio && (
                <div className="relative">
                  <audio
                    src={frontendAudio}
                    controls
                    className="w-[200px] rounded-lg shadow-gray-400 shadow-lg"
                  />
                  <FaTimes
                    size={22}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 cursor-pointer"
                    onClick={() => {
                      setFrontendAudio(null);
                      setBackendAudio(null);
                    }}
                  />
                </div>
              )}
              {frontendFileName && (
                <div className="relative p-2 bg-white rounded-lg shadow-gray-400 shadow-lg text-black">
                  📎 {frontendFileName}
                  <FaTimes
                    size={18}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 cursor-pointer"
                    onClick={() => {
                      setFrontendFileName(null);
                      setBackendFile(null);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Input Box */}
          <form
            className={`w-[95%] lg:max-w-[80%] h-[50px] rounded-full flex items-center gap-[10px] px-[20px]   ${
              darkMode ? " bg-blue-800 shadow-none" : "shadow-gray-400 shadow-lg bg-[#4e5bce]"
            }`}
            onSubmit={handleSendMessage}
          >
            <div className="flex items-center gap-[20px]">
              <div onClick={() => setShowPicker((prev) => !prev)}>
                <GrEmoji className="w-[28px] h-[28px] text-white cursor-pointer" />
              </div>
              {selectedUser?._id !== "ai_bot" && (
                <div onClick={() => setShowAttachmentMenu((prev) => !prev)}>
                  <MdAttachFile className="w-[25px] h-[25px] text-white cursor-pointer" />
                </div>
              )}
            </div>

            {showAttachmentMenu && selectedUser?._id !== "ai_bot" && (
              <div className={`absolute bottom-[70px] left-[60px] flex flex-col gap-3 shadow-lg rounded-xl p-3 z-20 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}>
                <div
                  onClick={() => image.current.click()}
                  className={`flex items-center gap-2 cursor-pointer  p-2 rounded-lg ${
                    darkMode ? "hover:bg-gray-900" : "hover:bg-gray-200"
                  }`}
                >
                  <FaFileImage /> Image
                </div>
                <div
                  onClick={() => video.current.click()}
                  className={`flex items-center gap-2 cursor-pointer  p-2 rounded-lg ${
                    darkMode ? "hover:bg-gray-900" : "hover:bg-gray-200"
                  }`}
                >
                  <FaVideo /> Video
                </div>
                <div
                  onClick={() => file.current.click()}
                  className={`flex items-center gap-2 cursor-pointer  p-2 rounded-lg ${
                    darkMode ? "hover:bg-gray-900" : "hover:bg-gray-200"
                  }`}
                >
                  <FaFileAlt /> File
                </div>
                <div
                  onClick={() => audio.current.click()}
                  className={`flex items-center gap-2 cursor-pointer  p-2 rounded-lg ${
                    darkMode ? "hover:bg-gray-900" : "hover:bg-gray-200"
                  }`}
                >
                  <FaMicrophone /> Audio
                </div>
              </div>
            )}
            {/* Hidden file inputs */}
            <input
              type="file"
              accept="image/*"
              ref={image}
              hidden
              onChange={handleImage}
            />
            <input
              type="file"
              accept="video/*"
              ref={video}
              hidden
              onChange={handleVideo}
            />
            <input type="file" ref={file} hidden onChange={handleFile} />
            <input
              type="file"
              accept="audio/*"
              ref={audio}
              hidden
              onChange={handleAudio}
            />

            <input
              type="text"
              className={`w-full h-full px-[10px] outline-none border-0 text-[16px]  ${
                darkMode?"bg-white text-black":"bg-white"
              }`}
              placeholder="Type a message"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />

            <button type="submit">
              <IoSend className="w-[25px] h-[25px] text-white cursor-pointer" />
            </button>
          </form>
        </div>
      )}

      {/* Fullscreen Media Viewer */}
      {fullscreenMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          {fullscreenMedia.type === "image" ? (
            <img
              src={fullscreenMedia.src}
              alt="fullscreen"
              className="max-w-[90%] max-h-[90%] rounded-lg"
            />
          ) : (
            <video
              src={fullscreenMedia.src}
              controls
              autoPlay
              className="max-w-[90%] max-h-[90%] rounded-lg"
            />
          )}
          <FaTimes
            className="absolute top-5 right-5 text-white text-3xl cursor-pointer"
            onClick={() => setFullscreenMedia(null)}
          />
        </div>
      )}

      {/* Profile sidebar */}
      <ProfileSlidebar
        selectedUser={selectedUser}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
      />
    </div>
  );
};

export default MessageArea;
