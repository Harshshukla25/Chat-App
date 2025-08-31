// import uploadOnCloudinary from "../config/clodinary.js"
// import User from "../models/user.model.js"

// export const getCurrentUser=async (req,res)=>{
// try {
//     const userId= req.userId
//     const user=await User.findById(userId).select("-password")
//     if(!user){
//         return res.status(400).json({message:"user not found"})
//     }
//     return res.status(200).json(user)
// } catch (error) {
//     return res.status(500).json({message:`current user error ${error}`})
// }
// }


// export const editProfile = async (req, res) => {
//   try {
//     const { name, bio } = req.body;
//     let image;

//     if (req.file) {
//       image = await uploadOnCloudinary(req.file.path);
//     }

//     const updateData = { name, bio };
//     if (image) updateData.image = image;

//     const user = await User.findByIdAndUpdate(
//       req.userId,
//       updateData,
//       { new: true, runValidators: true }
//     ).select("-password");

//     if (!user) {
//       return res.status(400).json({ message: "user not found" });
//     }

//     return res.status(200).json(user); // ✅ fixed
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "profile error", error: error.message });
//   }
// };


// export const getOtherUsers=async (req,res)=>{
//   try {
//     const users=await User.find({
//       _id:{$ne:req.userId}
//     }).select("-password")
//     return res.status(200).json(users)
//   } catch (error) {
//     return res.status(500).json({message:`get other users error ${error}`})
//   }
// }

// export const search=async (req,res)=>{
//   try {
//     const {query}=req.query
//     if(!query){
//       return res.status(400).json({
//         message:"query is required"
//       })
//     }
//     const users=await User.find({
//       $or:[
//         {name:{$regex:query,$options:"i"}},
//         {userName:{$regex:query,$options:"i"}},
//       ]
//     })
//     return res.status(200).json(users)
//   } catch (error) {
//     return res.status(500).json({message:`search users error ${error}`})
//   }
// }




import uploadOnCloudinary from "../config/clodinary.js"
import User from "../models/user.model.js"

export const getCurrentUser = async (req,res) => {
try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if(!user){
        return res.status(400).json({message:"user not found"});
    }
    return res.status(200).json(user);
} catch (error) {
    return res.status(500).json({message:`current user error ${error}`});
}
}

export const editProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file); // Changed: removed .path
    }

    const updateData = { name, bio };
    if (image) updateData.image = image;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(user); // ✅ fixed
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "profile error", error: error.message });
  }
};

export const getOtherUsers = async (req,res) => {
  try {
    const users = await User.find({
      _id:{$ne:req.userId}
    }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({message:`get other users error ${error}`});
  }
}

export const search = async (req,res) => {
  try {
    const {query} = req.query;
    if(!query){
      return res.status(400).json({
        message:"query is required"
      });
    }
    const users = await User.find({
      $or:[
        {name:{$regex:query,$options:"i"}},
        {userName:{$regex:query,$options:"i"}},
      ]
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({message:`search users error ${error}`});
  }
}