import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs, setAllAdminJobs } from "@/redux/jobSlice"; 
import { JOB_API_END_POINT } from "@/utils/constant";

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, {
                    withCredentials: true,
                });

                if (res.data.success) {
                    console.log("Babuji, MySQL Jobs Received:", res.data.jobs); 
                    dispatch(setAllJobs(res.data.jobs));
                } else {
                    dispatch(setAllJobs([]));
                }
            } catch (error) {
                console.log("Error fetching jobs:", error);
                dispatch(setAllJobs([])); 
            }
        };

        fetchAllJobs();
    }, [searchedQuery, dispatch]); // Re-run when user searches
};

export default useGetAllJobs;
