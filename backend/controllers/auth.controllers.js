import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import validator from "validator"
import sendEmail from "../utils/sendEmails.js"
import jwt from "jsonwebtoken"


export const signup= async(req,res)=>{
    try {
        const {userName,email,password}=req.body
        
        if(!validator.isEmail(email)){
            return res.status(400).json({
                message:"Please enter a valid email"
            })
        }
        
        const strongPasswordRegex=  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      })
    }


        const checkUserByUserName= await User.findOne({userName})
        if(checkUserByUserName){
            return res.status(400).json({message:"userName already exists"})
        }

        const checkUserByEmail= await User.findOne({email})
        if(checkUserByEmail){
            return res.status(400).json({message:"email already exist"})
        }

    const hashedPassword=await bcrypt.hash(password,10)

    const user=await User.create({
        userName,email,password:hashedPassword
    })

    const token=await genToken(user._id)

    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        secure:true,
        sameSite:"None"
        
    })

    return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({message:`signup error ${error}`})
    }
}




export const login= async(req,res)=>{
    try {
        const {email,password}=req.body

        const user= await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user does not exist"})
        }

    const isMatched=await bcrypt.compare(password,user.password)
    if(!isMatched){
        return res.status(400).json({message:"incorrect password"})
    }
    
    const token=await genToken(user._id)

    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        secure:true,
        sameSite:"None"
        
    })

    return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message:`login error ${error}`})
    }
}


export const logout= async (req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"log out successfully"})
    } catch (error) {
        return res.status(500).json({message:`log out error ${error}`})
    }
}


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token (valid for 15min)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const resetUrl = `https://chat-app-henna-one.vercel.app/reset-password/${resetToken}`

    // Send email
    await sendEmail(
      user.email,
      "Password Reset Request",
      `Click the link to reset your password: ${resetUrl}`
    );

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;  // if using /reset-password/:token
    const { password } = req.body;

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};