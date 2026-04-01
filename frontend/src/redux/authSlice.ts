import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define the shape of our User and Auth state
interface User {
    _id: string;
    fullname: string;
    email: string;
    phoneNumber: string;
    role: 'student' | 'recruiter';
    profile: {
        bio?: string;
        skills?: string[];
        resume?: string;
        resumeOriginalName?: string;
        profilePhoto?: string;
    };
}

interface AuthState {
    loading: boolean;
    user: User | null;
}

// 2. Set the initial state with that type
const initialState: AuthState = {
    loading: false,
    user: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // JI BABUJI: PayloadAction<boolean> ensures you only pass true/false to loading
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        // PayloadAction<User | null> allows for updating or logging out (null)
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        }
    }
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;