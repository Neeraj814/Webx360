import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// --- Register User ---
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "Something is missing", success: false });
        };

        const file = req.file;
        let cloudResponse;
        
        // Image upload (Optional check)
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        // MySQL: Check if user exists
        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exist with this email.', success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // MySQL: Create new user
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

// --- Login User ---
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Something is missing", success: false });
        };

        // MySQL: Find user by email
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

        // 🟢 Production Fix: Cross-domain cookies for Vercel & Render
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

// --- Logout User ---
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
        return res.status(500).json({ message: "Logout failed", success: false });
    }
}

// --- Update Profile ---
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        let cloudResponse;

        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        const userId = req.id; // From isAuthenticated middleware
        
        // MySQL: Find user by Primary Key
        let user = await User.findByPk(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        // Updating data (MySQL specific)
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.bio = bio;
        if (skills) user.skills = skills; 

        if (cloudResponse) {
            user.resume = cloudResponse.secure_url;
            user.resumeOriginalName = file.originalname;
        }

        await user.save(); // Sync changes to MySQL

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
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: userResponse,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Update failed", success: false });
    }
}
