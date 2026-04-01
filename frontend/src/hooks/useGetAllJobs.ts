import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs, setAllAdminJobs } from "@/redux/jobSlice"; // 🟢 Import both
import { JOB_API_END_POINT } from "@/utils/constant";

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                // 🟢 Added search query support for the main job page
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, {
                    withCredentials: true,
                });

                if (res.data.success) {
                    console.log("Babuji, MySQL Jobs Received:", res.data.jobs); // 🔍 Debugging
                    dispatch(setAllJobs(res.data.jobs));
                } else {
                    // 🟢 Force reset if success is false or no jobs found
                    dispatch(setAllJobs([]));
                }
            } catch (error) {
                console.log("Error fetching jobs:", error);
                dispatch(setAllJobs([])); // 🟢 Reset on error to clear "ghost" data
            }
        };

        fetchAllJobs();
    }, [searchedQuery, dispatch]); // Re-run when user searches
};

export default useGetAllJobs;