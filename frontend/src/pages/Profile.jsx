import React, { useRef, useState } from 'react'
import default_dp from '../assets/defaultDp.webp'
import { IoCameraOutline, IoArrowBackSharp } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../main'
import { setUserData } from '../redux/userSlice'
import { useTheme } from '../context/ThemeContext'

const Profile = () => {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {darkMode}=useTheme()

  const [name, setName] = useState(userData.name || "")
  const [frontendImage, setFrontendImage] = useState(userData.image || default_dp)
  const [backendImage, setBackendImage] = useState(null)
  const [userBio, setUserBio] = useState(userData.bio || "")
  const [bio, setBio] = useState("")

  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)    // profile preview
  const [isPickerOpen, setIsPickerOpen] = useState(false)  // gallery/camera menu
  const [isCameraOpen, setIsCameraOpen] = useState(false)  // webcam modal

  const imagePicker = useRef()
  const videoRef = useRef()
  const canvasRef = useRef()

  // File Upload (gallery)
  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  // Save Profile
  const handleProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("bio", userBio)
      if (backendImage) {
        formData.append("image", backendImage)
      }
      const result = await axios.put(`${serverUrl}/api/user/profile`, formData, {
        withCredentials: true,
      })
      setSaving(false)
      dispatch(setUserData(result.data))
      navigate("/")
    } catch (err) {
      console.log(err)
    } finally {
      setSaving(false)
    }
  }

  // Open webcam stream
  const startCamera = async () => {
    setIsCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)
    }
  }

  // Capture photo from webcam
  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const context = canvas.getContext("2d")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" })
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(blob))
    }, "image/jpeg", 1)
    stopCamera()
  }

  // Stop webcam
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
    }
    setIsCameraOpen(false) 
  }

  return (
    <div className={`w-full h-screen flex justify-center items-center
    ${darkMode ? "bg-gray-900" :"bg-gray-100 "} `}>
      {/* Back Button */}
      <div className="fixed top-[20px] left-[20px]" onClick={() => navigate("/")}>
        <IoArrowBackSharp className={`w-[50px] h-[40px] cursor-pointer ${darkMode?"text-white":"text-black"}`}  />
      </div>

      <div className={` w-[95%] max-w-[450px] rounded-xl shadow-md p-4 flex flex-col items-center gap-2 ${darkMode ? "bg-gray-700":"bg-white"}`}>
        
        {/* Profile Picture */}
        <div className="relative">
          <input type="file" accept="image/*" ref={imagePicker} hidden onChange={handleImage} />

          <div
            className={`w-28 h-28 rounded-full overflow-hidden border-4 mt-2 cursor-pointer ${darkMode?"border-indigo-700":" border-indigo-500 shadow-md "}`}
            onClick={() => setIsModalOpen(true)}
          >
            <img src={frontendImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
          </div>

          {/* Camera Icon */}
          <button
            className="absolute bottom-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            onClick={() => setIsPickerOpen(true)}
          >
            <IoCameraOutline className="w-5 h-5" />
          </button>
        </div>

        {/* ... Profile Form (same as your version) ... */}
        {/* KEEP your form for name, email, bio etc here */}


        {/* Header */}
        <div className="text-center">
          <h2 className={`text-xl font-semibold  ${darkMode?"text-white":"text-gray-800"}`}>Edit Profile</h2>
          <p className={`text-sm  ${darkMode?"text-gray-100":"text-gray-500"}`}>Update your personal details</p>
        </div>

        {/* Profile Form */}
        <form className="w-full flex flex-col gap-3" onSubmit={handleProfile}>
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className={`text-sm font-medium ${darkMode ?"text-gray-100":"text-gray-700 "}`}>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className={`w-full h-[36px] px-3 border rounded-lg bg-white shadow-sm  outline-none  transition ${darkMode?"text-gray-900 focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700":"text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"}`}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className={`text-sm font-medium ${darkMode ?"text-gray-100":"text-gray-700 "}`}>Username</label>
            <input
              type="text"
              readOnly
              value={userData?.userName}
              className={`w-full h-[36px] px-3 border rounded-lg  shadow-sm  cursor-not-allowed bg-gray-100 ${darkMode?"text-gray-900":"text-gray-500 "}`}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className={`text-sm font-medium ${darkMode ?"text-gray-100":"text-gray-700 "}`}>Email</label>
            <input
              type="email"
              readOnly
              value={userData?.email}
              className={`w-full h-[36px] px-3 border rounded-lg bg-gray-100 shadow-sm cursor-not-allowed ${darkMode?"text-gray-900":"text-gray-500 "}`}
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1">
            <label className={`text-sm font-medium ${darkMode ?"text-gray-100":"text-gray-700 "}`}>Bio</label>
            <textarea
              placeholder="Write a short bio..."
              rows="2"
              maxLength={50}
              value={userBio}
              onChange={(e) => {
                setBio(e.target.value)
                setUserBio(e.target.value)
              }}
              className={`w-full px-3 py-2 border rounded-lg bg-white shadow-sm  resize-none outline-none  transition ${darkMode?"text-gray-900 focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700":"text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"}`}
            />
            <p
  className={`text-xs text-right ${
    bio.length > 40
      ? darkMode
        ? "text-red-400"
        : "text-red-500"
      : darkMode
      ? "text-gray-200"
      : "text-gray-500"
  }`}
>
              {bio.length}/50
            </p>
          </div>

          <button
            className={`w-full py-1 text-lg  rounded-lg text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95 transition cursor-pointer ${darkMode?"bg-indigo-600 hover:bg-indigo-700":"bg-indigo-600 hover:bg-indigo-700"}`}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* Profile Preview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="relative">
            <img src={frontendImage} alt="Full View" className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg" />
            <button
              className="absolute top-2 right-2 text-white bg-black/50 p-2 rounded-full"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Upload Options */}
      {isPickerOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-end z-50">
          <div className="bg-white w-full max-w-[450px] rounded-t-2xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold text-center mb-4">Upload Profile Photo</h3>
            <button
              className="w-full py-2 mb-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              onClick={() => {
                setIsPickerOpen(false)
                imagePicker.current.click()
              }}
            >
              Choose from Gallery
            </button>
            <button
              className="w-full py-2 mb-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={() => {
                setIsPickerOpen(false)
                startCamera()
              }}
            >
              Open Camera
            </button>
            <button
              className="w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => setIsPickerOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Webcam Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-lg">
            <video ref={videoRef} autoPlay playsInline className="w-[400px] h-[300px] rounded-lg bg-black" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex justify-between mt-3 gap-2">
              <button
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={capturePhoto}
              >
                Capture
              </button>
              <button
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={stopCamera}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default Profile
