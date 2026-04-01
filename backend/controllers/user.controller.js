import User from "../models/user.model.js"; // Ensure this matches your Sequelize model
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
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        // 🟢 MySQL Change: use 'where' clause
        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exist with this email.', success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 🟢 MySQL Change: Create with flattened profile fields
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profilePhoto: cloudResponse.secure_url
        });

        return res.status(201).json({ message: "Account created successfully.", success: true });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Something is missing", success: false });
        };

        // 🟢 MySQL Change: use 'where'
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

        const tokenData = { userId: user.id }; // 🟢 MySQL uses 'id', not '_id'
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        // 🟢 Format response to match your Frontend's expectation
        const userResponse = {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: {
                bio: user.bio,
                skills: user.skills, // Your model getter handles the split automatically
                profilePhoto: user.profilePhoto,
                resume: user.resume,
                resumeOriginalName: user.resumeOriginalName
            }
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user: userResponse,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        let cloudResponse;

        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        const userId = req.id; // From auth middleware
        
        // 🟢 MySQL Change: findByPk (Find By Primary Key)
        let user = await User.findByPk(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        // 🟢 MySQL Update logic (Flattened)
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.bio = bio;
        if (skills) user.skills = skills; // Setter in model converts array to string

        if (cloudResponse) {
            user.resume = cloudResponse.secure_url;
            user.resumeOriginalName = file.originalname;
        }

        await user.save();

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
    }
}