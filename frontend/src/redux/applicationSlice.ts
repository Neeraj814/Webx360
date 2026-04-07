import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define the Applicant structure
interface Applicant {
    _id: string;
    fullname: string;
    email: string;
    phoneNumber: string;
    profile: {
        profilePhoto?: string;
        resume?: string;
        resumeOriginalName?: string;
    };
    status?: 'pending' | 'accepted' | 'rejected'; 
}

interface ApplicationState {
    applicants: any | null; 
}

const initialState: ApplicationState = {
    applicants: null,
};

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        setAllApplicants: (state, action: PayloadAction<any>) => {
            state.applicants = action.payload;
        }
    }
});

export const { setAllApplicants } = applicationSlice.actions;

export default applicationSlice.reducer;
