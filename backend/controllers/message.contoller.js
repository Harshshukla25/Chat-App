// import uploadOnCloudinary from "../config/clodinary.js";
// import Conversation from "../models/conversation.model.js";
// import Message from "../models/message.model.js";
// import {io, getReceiverSocketId } from "../socket/socket.js";
// import axios from "axios";

// export const sendMessage = async (req, res) => {
//   try {
//     const sender = req.userId;
//     const { receiver } = req.params;
//     const { message } = req.body;

//     let image, video, audio, file, fileName, fileType;

//     if (req.files?.image) {
//       image = await uploadOnCloudinary(req.files.image[0].path);
     
//     }

//     if (req.files?.video) {
//       video = await uploadOnCloudinary(req.files.video[0].path);
      
//     }

//     if (req.files?.audio) {
//        audio= await uploadOnCloudinary(req.files.audio[0].path);
      
//     }

//     if (req.files?.file) {
//       file = await uploadOnCloudinary(req.files.file[0].path);
    
//       fileName = req.files.file[0].originalname;
//       fileType = req.files.file[0].mimetype;
//     }

//     // ✅ Create message
//     const newMessage = await Message.create({
//       sender,
//       receiver,
//       message: message || "",
//       image,
//       video,
//       audio,
//       file,
//       fileName,
//       fileType
//     });

//     // ✅ Check conversation
//     let conversation = await Conversation.findOne({
//       participants: { $all: [sender, receiver] }
//     });

//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [sender, receiver],
//         messages: [newMessage._id]
//       });
//     } else {
//       conversation.messages.push(newMessage._id);
//       await conversation.save();
//     }
     
// const receiverSocketId=getReceiverSocketId(receiver)
// if(receiverSocketId){
//     io.to(receiverSocketId).emit("newMessage",newMessage)
// }




//     return res.status(201).json(newMessage);
//   } catch (error) {
//     return res.status(500).json({ message: `send Message error ${error}` });
//   }
// };


// export const getMessages=async (req,res)=>{
//     try {
//         const sender=req.userId
//         const {receiver}=req.params
//         const conversation=await Conversation.findOne({
//             participants:{$all:[sender,receiver]}
//         }).populate("messages")
//         if(!conversation){
//             return res.status(400).json({message:"conversation not found"})
//         }
//         return res.status(200).json(conversation?.messages)
//     } catch (error) {
//         return res.status(500).json({message:`get Message error ${error}`})
//     }
// }






// export const chatWithAI = async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message) {
//       return res.status(400).json({ message: "Message is required" });
//     }

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [{ role: "user", parts: [{ text: message }] }],
//       },
//       {
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     const aiReply =
//       response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "No response from AI";

//     return res.status(200).json({ reply: aiReply });
//   } catch (error) {
//     console.error(
//       "❌ AI Chat Error:",
//       error.response?.data || error.message || error
//     );
//     return res.status(500).json({
//       message: "AI chat failed",
//       error: error.response?.data || error.message || "Unknown error",
//     });
//   }
// };


import uploadOnCloudinary from "../config/clodinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import {io, getReceiverSocketId } from "../socket/socket.js";
import axios from "axios";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;
    const { message } = req.body;

    let image, video, audio, file, fileName, fileType;

    // Pass file object instead of file path
    if (req.files?.image) {
      image = await uploadOnCloudinary(req.files.image[0]); // Changed: removed .path
    }

    if (req.files?.video) {
      video = await uploadOnCloudinary(req.files.video[0]); // Changed: removed .path
    }

    if (req.files?.audio) {
       audio = await uploadOnCloudinary(req.files.audio[0]); // Changed: removed .path
    }

    if (req.files?.file) {
      file = await uploadOnCloudinary(req.files.file[0]); // Changed: removed .path
      fileName = req.files.file[0].originalname;
      fileType = req.files.file[0].mimetype;
    }

    // ✅ Create message
    const newMessage = await Message.create({
      sender,
      receiver,
      message: message || "",
      image,
      video,
      audio,
      file,
      fileName,
      fileType
    });

    // ✅ Check conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [newMessage._id]
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }
     
    const receiverSocketId = getReceiverSocketId(receiver);
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Send Message Error:", error); // Better error logging
    return res.status(500).json({ 
      message: `Send Message error: ${error.message}`
    });
  }
};

export const getMessages = async (req,res) => {
    try {
        const sender = req.userId;
        const {receiver} = req.params;
        const conversation = await Conversation.findOne({
            participants:{$all:[sender,receiver]}
        }).populate("messages");
        if(!conversation){
            return res.status(400).json({message:"conversation not found"});
        }
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        return res.status(500).json({message:`get Message error ${error}`});
    }
}

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: message }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const aiReply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    return res.status(200).json({ reply: aiReply });
  } catch (error) {
    console.error(
      "⚠ AI Chat Error:",
      error.response?.data || error.message || error
    );
    return res.status(500).json({
      message: "AI chat failed",
      error: error.response?.data || error.message || "Unknown error",
    });
  }
};
