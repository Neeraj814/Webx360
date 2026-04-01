import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                // JI BABUJI: Your use of withCredentials is correct here.
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
                    withCredentials: true
                });

                if (res.data.success) {
                    // Ensure we pass the data correctly to Redux
                    dispatch(setAllAppliedJobs(res.data.application || []));
                }
            } catch (error: any) {
                // If this logs 401, the browser has no token or the backend rejected it
                console.error("Fetch Applied Jobs Error:", error.response?.data?.message || error.message);
            }
        };
        fetchAppliedJobs();
    }, [dispatch]); // Added dispatch to dependency array for best practice
};

export default useGetAppliedJobs;