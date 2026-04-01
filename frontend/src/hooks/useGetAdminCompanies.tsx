import { setCompanies } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAdminCompanies = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAdminCompanies = async () => {
            try {
                // ✅ Use '/get' which is your Route #3 (Authenticated & Filtered)
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.log("Error fetching admin companies:", error);
            }
        };
        fetchAdminCompanies();
    }, [dispatch]);
};

export default useGetAdminCompanies;