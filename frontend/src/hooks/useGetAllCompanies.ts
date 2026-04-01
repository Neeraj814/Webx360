import { setCompanies } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminCompanies = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                // ✅ Using /get ensures the backend filters by req.id (Your companies only)
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`, { 
                    withCredentials: true 
                });

                if (res.data.success) {
                    // Make sure your backend returns 'companies' (plural)
                    dispatch(setCompanies(res.data.companies)); 
                }
            } catch (error: any) {
                console.error("Error fetching admin companies:", error.response?.data?.message || error.message);
            }
        };
        
        fetchCompanies();
        
        // Optional: Adding a cleanup or a dependency check is good practice
    }, [dispatch]); 
};

export default useGetAllAdminCompanies;