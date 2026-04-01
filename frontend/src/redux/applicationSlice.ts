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
    // If your backend returns the specific application status
    status?: 'pending' | 'accepted' | 'rejected'; 
}

// 2. Define the State Interface
interface ApplicationState {
    applicants: any | null; // Keeping it 'any' or 'Applicant[]' based on your API nesting
}

// 3. Set Initial State
const initialState: ApplicationState = {
    applicants: null,
};

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        // JI BABUJI: Typed action for setting all applicants
        setAllApplicants: (state, action: PayloadAction<any>) => {
            state.applicants = action.payload;
        }
    }
});

export const { setAllApplicants } = applicationSlice.actions;

export default applicationSlice.reducer;