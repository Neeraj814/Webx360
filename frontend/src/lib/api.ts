import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

// 1. Create a centralized Axios instance
// This ensures 'withCredentials' is sent every time for your JWT cookies
const API = axios.create({
    baseURL: USER_API_END_POINT, 
    withCredentials: true,
});

// 2. Define the User Interface matching your MongoDB Schema
export interface AuthUser {
    _id: string;
    fullname: string;      // Back-end uses 'fullname'
    email: string;
    phoneNumber: string;   // Back-end uses 'phoneNumber'
    role: "student" | "recruiter";
    profile: {
        bio?: string;
        skills?: string[];
        resume?: string;
        resumeOriginalName?: string;
        profilePhoto?: string;
    };
}

// 3. Auth API Methods
export const authApi = {
    // LOGIN: Hits http://localhost:8000/api/v1/user/login
    login: async (email: string, password: string, role: string) => {
        const response = await API.post("/login", { email, password, role });
        return response.data; // Returns { message, user, success }
    },

    // REGISTER: Hits http://localhost:8000/api/v1/user/register
    // Uses FormData because of the profile photo upload
    register: async (formData: FormData) => {
        const response = await API.post("/register", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // LOGOUT: Hits http://localhost:8000/api/v1/user/logout
    logout: async () => {
        const response = await API.get("/logout");
        return response.data;
    },

    // UPDATE PROFILE: Hits http://localhost:8000/api/v1/user/profile/update
    updateProfile: async (formData: FormData) => {
        const response = await API.post("/profile/update", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};