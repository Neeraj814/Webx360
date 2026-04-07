import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const initialState: AuthState = {
    loading: false,
    user: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        }
    }
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;
