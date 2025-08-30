import mongoose from 'mongoose'
const messageSchema= new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:""
    },
    
    video: {
        type: String,
        default: ""
    },
    audio: {
        type: String,
        default: ""
    },
    file: {
        type: String,
        default: ""   // could store file URL (e.g. pdf/doc)
    },
    fileName: {
        type: String,
        default: ""   // original filename for docs
    },
    fileType: {
        type: String,
        default: ""   // mime-type (image/png, video/mp4, application/pdf, etc.)
    }

},{timestamps:true})

const Message=mongoose.model("Message",messageSchema)
export default Message