


import React, { useState } from "react";
import { FaFileDownload, FaPlay, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import dp from "../assets/defaultDp.webp";
import moment from "moment";
import { useTheme } from "../context/ThemeContext";

const SenderMessage = ({ image, video, audio, file, fileName, message, createdAt }) => {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(false);
  const { userData } = useSelector((state) => state.user);
    const { darkMode } = useTheme();

  // Decide bubble styles
  const isMediaOnly = (image || video || audio) && !message && !file;
  const isFileOnly = file && !image && !video && !audio && !message;

  return (
    <>
      <div className="flex items-center gap-[10px]">
       <div
  className={`w-fit max-w-[500px] ml-auto mb-3 flex flex-col gap-2 
    ${
      isMediaOnly
        ? ""
        : isFileOnly
        ? `${darkMode 
            ? "bg-[#596bf0] text-white shadow-black" 
            : "bg-[#4e5bce] text-white shadow-gray-400"} px-3 py-2 rounded-xl text-[14px]`
        : `${darkMode 
            ? "bg-[#596bf0] text-white shadow-black" 
            : "bg-[#4e5bce] text-white shadow-gray-400"} px-4 py-2 text-[16px] rounded-tr-none rounded-2xl`
    }`}
>
          {/* Image */}
          {image && (
            <img
              src={image}
              alt="sent"
              className={`w-[200px] rounded-lg shadow-md cursor-pointer ${
                darkMode ? "shadow-none" : "shadow-md"
              }`}
              onClick={() => setFullscreenImage(image)}
            />
          )}

          {/* Video */}
          {video && (
            <div className="relative w-[250px] rounded-lg shadow-md overflow-hidden">
              {!playingVideo ? (
                <div
                  className="relative cursor-pointer"
                  onClick={() => setPlayingVideo(true)}
                >
                  <video src={video} className="w-full h-full object-cover" muted />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <FaPlay className="text-white text-3xl" />
                  </div>
                </div>
              ) : (
                <video
                  src={video}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          {/* Audio */}
          {audio && (
            <audio
              src={audio}
              controls
              className="w-[250px] rounded-lg shadow-gray-400 shadow-md"
            />
          )}

          {/* File */}
          {file && (
            <a
              href={file}
              download={fileName}
              className="flex items-center gap-2 underline break-words"
            >
              <FaFileDownload />
              {fileName?.length > 25
                ? fileName.substring(0, 20) + "... ." + fileName.split(".").pop()
                : fileName}
            </a>
          )}

          {/* Text only */}
          {message && !image && !video && !audio && !file && (
            <div className="flex gap-3">
              <span className="text-[15px]">{message}</span>
              <span className="text-[9px] mt-3">
                {moment(createdAt).format("hh:mm A")}
              </span>
            </div>
          )}

          {/* Text + Media/File (no duplicate time inside) */}
          {message && (image || video || audio || file) && (
            <span className="text-[15px]">{message}</span>
          )}

          {/* ✅ Single time shown below media (with/without text) */}
          {(image || video || audio || file) && (
            <span className="text-[10px] mt-1 ml-auto">
              {moment(createdAt).format("hh:mm A")}
            </span>
          )}
        </div>

        {/* Sender Avatar */}
        <div className={`w-[30px] h-[30px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer  ${
          darkMode?"shadow-none": "shadow-gray-400 shadow-lg"
        }`}>
          <img
            src={userData.image || dp}
            alt=""
            className="h-[100%]"
            onClick={() => setFullscreenImage(userData.image || dp)}
          />
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 bg-gray-800 p-2 rounded-full text-white"
            onClick={() => setFullscreenImage(null)}
          >
            <FaTimes size={24} />
          </button>
          <img
            src={fullscreenImage}
            alt="fullscreen"
            className="max-h-[90%] max-w-[90%] rounded-lg"
          />
        </div>
      )}
    </>
  );
};

export default SenderMessage;




