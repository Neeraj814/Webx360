import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "Something is missing", success: false });
        };

        const file = req.file;
        let cloudResponse;
        
        // 🟢 Logic: Make file optional to prevent crash if photo is missing
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exist with this email.', success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profilePhoto: cloudResponse ? cloudResponse.secure_url : ""
        });

        return res.status(201).json({ message: "Account created successfully.", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Something is missing", success: false });
        };

        let user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Incorrect email or password.", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect email or password.", success: false });
        };

        if (role !== user.role) {
            return res.status(400).json({ message: "Account doesn't exist with current role.", success: false });
        };

        const tokenData = { userId: user.id };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        const userResponse = {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: {
                bio: user.bio,
                skills: user.skills,
                profilePhoto: user.profilePhoto,
                resume: user.resume,
                resumeOriginalName: user.resumeOriginalName
            }
        }

        // 🟢 CRITICAL PRODUCTION FIX: SameSite 'none' and Secure 'true'
        // Ye setting Vercel aur Render ke beech cookies allow karegi
        return res.status(200).cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            sameSite: 'none', 
            secure: true 
        }).json({
            message: `Welcome back ${user.fullname}`,
            user: userResponse,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Login failed", success: false });
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { 
            maxAge: 0,
            sameSite: 'none',
            secure: true 
        }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
