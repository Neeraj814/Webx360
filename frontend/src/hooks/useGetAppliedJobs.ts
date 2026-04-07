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
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
                    withCredentials: true
                });

                if (res.data.success) {
                    dispatch(setAllAppliedJobs(res.data.application || []));
                }
            } catch (error: any) {
                console.error("Fetch Applied Jobs Error:", error.response?.data?.message || error.message);
            }
        };
        fetchAppliedJobs();
    }, [dispatch]); 
};

export default useGetAppliedJobs;
