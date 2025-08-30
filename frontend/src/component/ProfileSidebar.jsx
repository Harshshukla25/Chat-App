import React from "react";
import { FaTimes } from "react-icons/fa";
import default_dp from "../assets/defaultDp.webp";

const ProfileSlidebar = ({ selectedUser, showProfile, setShowProfile }) => {
  if (!selectedUser) return null;

  return (
    <>
      {showProfile && (
        <div
          className="absolute inset-0 z-40"
          onClick={() => setShowProfile(false)}
        />
      )}
      <div
        className={`absolute top-0 right-0 h-full w-full sm:w-[320px] bg-white shadow-lg transform transition-transform duration-300 z-50
        ${showProfile ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex  items-center justify-center    p-4 border-b">
          <h2 className="text-xl font-semibold text-black">Profile</h2>
          <FaTimes
            className=" cursor-pointer text-gray-600 ml-6"
            onClick={() => setShowProfile(false)}
          />
        </div>

        <div className="flex flex-col items-center p-6 overflow-y-auto h-[calc(100%-57px)]">
          <img
            src={selectedUser?.image || default_dp}
            alt="profile"
            className="w-28 h-28 rounded-full mb-4 border-black border-2 shadow object-cover"
          />
          <h3 className="text-xl font-bold">
            {selectedUser?.name || selectedUser?.userName}
          </h3>
          {selectedUser?.userName && (
            <p className="text-gray-600">@{selectedUser.userName}</p>
          )}
          <p className="text-gray-700 mt-3 text-center px-2">
            {selectedUser?.bio || "No bio available"}
          </p>
          <div className="mt-4 w-full text-sm text-gray-600 space-y-1">
            <p>
              <strong>Email:</strong> {selectedUser?.email || "N/A"}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {selectedUser?.createdAt
                ? new Date(selectedUser.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSlidebar;
