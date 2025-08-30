import React, { useState } from "react";
import { FaFileDownload, FaPlay, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import dp from "../assets/defaultDp.webp";
import { LuDownload } from "react-icons/lu";
import moment from "moment";
import { useTheme } from "../context/ThemeContext";

const ReceiverMessage = ({ image, video, audio, file, fileName, message, createdAt }) => {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(false);
  const { selectedUser } = useSelector((state) => state.user);
  const { darkMode } = useTheme();

  // Helper to truncate file names
  const getFileName = (filePath) => {
    const name = filePath.split("/").pop();
    if (name.length > 25) {
      const ext = name.split(".").pop();
      return name.substring(0, 20) + "... ." + ext;
    }
    return name;
  };


const getDownloadUrl = (url, fileName = "file") => {
  if (!url.includes("/upload/")) return url;
  return url.replace(
    "/upload/",
    `/upload/fl_attachment:${fileName}/`
  );
};





  const isMediaOnly = (image || video || audio) && !message && !file;
  const isFileOnly = file && !image && !video && !audio && !message;

  return (
    <>
      <div className="flex items-start gap-[10px]">
        <div className={`w-[30px] h-[30px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer 
          ${
            darkMode? "shadow-none" : "shadow-gray-400 shadow-md"
          }`}>
          <img
            src={selectedUser.image || dp}
            alt=""
            className="h-[100%]"
            onClick={() => setFullscreenImage(selectedUser.image || dp)}
          />
        </div>

        <div
          className={`w-fit max-w-[500px] mr-auto mb-3 flex flex-col gap-2 
          ${
            isMediaOnly
              ? ""
              : isFileOnly
              ? `${darkMode? "shadow-none bg-white " : " shadow-gray-400 shadow-md bg-[#cbcbd1]"} px-3 py-2 rounded-xl  text-[14px] text-black `
              : `${darkMode ? " shadow-none bg-white " : " shadow-gray-400 shadow-lg bg-[#cbcbd1] "}  px-4 py-2  text-[16px]  rounded-tl-none  rounded-2xl text-black `
          }`}
        >
          {/* Image */}
          {image && (
            <div className="relative w-fit">
              <img
                src={image}
                alt="received"
                className="w-[200px] rounded-lg shadow-md cursor-pointer"
                onClick={() => setFullscreenImage(image)}
              />
       <a
  href={getDownloadUrl(image, "photo.jpg")}
  download
  onClick={(e) => e.stopPropagation()}
  className="absolute bottom-2 right-2 bg-black bg-opacity-70 hover:bg-opacity-90 
             text-white p-2 rounded-full flex items-center justify-center transition"
>
  <LuDownload size={18} />
</a>



            </div>
          )}

          {/* Video with play overlay + download */}
          {video && !playingVideo && (
            <div
              className="relative w-[250px] h-[180px] bg-black rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => setPlayingVideo(true)}
            >
              <video
                src={video}
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <FaPlay className="text-white text-3xl z-10" />
              <a
                href={video}
                download
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-2 right-2 bg-black bg-opacity-70 hover:bg-opacity-90 
                           text-white p-2 rounded-full flex items-center justify-center transition z-20"
              >
                <LuDownload size={18} />
              </a>
            </div>
          )}

          {/* Playing video */}
          {playingVideo && (
            <video
              src={video}
              controls
              autoPlay
              className="w-[250px] rounded-lg shadow-md"
            />
          )}

          {/* Audio */}
          {audio && (
            <>
              <audio
                src={audio}
                controls
                className="w-[250px] rounded-lg shadow-gray-400 shadow-md"
              />
              <span className="text-sm text-gray-600">Voice message</span>
            </>
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

          {/* Text when combined with media/file (time moved outside) */}
          {message && (image || video || audio || file) && (
            <span className="text-[15px]">{message}</span>
          )}

          {/* ✅ Single time shown below media (with/without text) */}
          {(image || video || audio || file) && (
            <span className={`text-[10px]  px-1 mt-1 ml-auto 
            ${darkMode ?"text-white": "text-black"

            }`}>
              {moment(createdAt).format("hh:mm A")}
            </span>
          )}
        </div>
      </div>

      {/* Fullscreen image viewer */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="fullscreen"
            className="max-h-[90%] max-w-[90%] rounded-lg"
          />
          <button
            className="absolute top-4 right-4 bg-gray-800 p-2 rounded-full text-white"
            onClick={() => setFullscreenImage(null)}
          >
            <FaTimes size={24} />
          </button>
        </div>
      )}
    </>
  );
};

export default ReceiverMessage;



