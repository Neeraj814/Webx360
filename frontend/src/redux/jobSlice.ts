import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 🟢 MySQL Compatible Job Interface
export interface Job {
    id: string; // Changed from _id to id
    title: string;
    description: string;
    salary: number;
    location: string;
    jobType: string;
    experienceLevel: number;
    position: number;
    category: string; // Added category
    jobWebsite: string; // Added website
    company: {
        id: string; // Changed from _id to id
        name?: string;
        logo?: string;
    } | string; 
    applications?: any[]; // For calculating total applicants
    createdAt: string; 
}

interface JobState {
    allJobs: Job[];
    allAdminJobs: Job[];
    singleJob: Job | null;
    searchJobByText: string;
    allAppliedJobs: any[];
    searchedQuery: string;
}

const initialState: JobState = {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
};

const jobSlice = createSlice({
    name: "job",
    initialState,
    reducers: {
        setAllJobs: (state, action: PayloadAction<Job[]>) => {
            state.allJobs = action.payload || []; // Ensure it defaults to empty array
        },
        setSingleJob: (state, action: PayloadAction<Job | null>) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action: PayloadAction<Job[]>) => {
            // 🟢 FORCE RESET: If payload is null/undefined, set to empty
            state.allAdminJobs = action.payload || []; 
        },
        setSearchJobByText: (state, action: PayloadAction<string>) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action: PayloadAction<any[]>) => {
            state.allAppliedJobs = action.payload || [];
        },
        setSearchedQuery: (state, action: PayloadAction<string>) => {
            state.searchedQuery = action.payload;
        },
        // 🟢 NEW: Clear all job data (Use this on Logout)
        clearJobState: (state) => {
            state.allAdminJobs = [];
            state.allJobs = [];
            state.allAppliedJobs = [];
        }
    }
});

export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery,
    clearJobState
} = jobSlice.actions;

export default jobSlice.reducer;