// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';

// const uploadOnCloudinary = async (filePath) => {
//     cloudinary.config({
//         cloud_name: process.env.CLOUD_NAME,
//         api_key: process.env.API_KEY,
//         api_secret: process.env.API_SECRET
//     });

//     try {
//         const uploadResult = await cloudinary.uploader.upload(filePath, {
//             resource_type: "auto" // ✅ important for video/audio/pdf
//         });
//         fs.unlinkSync(filePath);
//         return uploadResult.secure_url;
//     } catch (error) {
//         fs.unlinkSync(filePath);
//         console.error("Cloudinary upload error:", error);
//         throw error; // ✅ rethrow so controller knows upload failed
//     }
// };

// export default uploadOnCloudinary;



import { v2 as cloudinary } from 'cloudinary';

const uploadOnCloudinary = async (file) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });

    try {
        // Upload from buffer instead of file path
        const uploadResult = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
            {
                resource_type: "auto" // ✅ important for video/audio/pdf
            }
        );
        return uploadResult.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error; // ✅ rethrow so controller knows upload failed
    }
};

export default uploadOnCloudinary;