import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // 🟢 Render key se match kiya
    api_key: process.env.CLOUDINARY_API_KEY,       // 🟢 Render key se match kiya
    api_secret: process.env.CLOUDINARY_API_SECRET  // 🟢 Render key se match kiya
});

export default cloudinary;
