// src/hooks/useGetPublicCompanies.ts
import { setCompanies } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetPublicCompanies = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchPublicCompanies = async () => {
            try {
                // 🚀 Notice we are calling /getall now!
                const res = await axios.get(`${COMPANY_API_END_POINT}/getall`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.log("Error fetching all companies:", error);
            }
        };
        fetchPublicCompanies();
    }, [dispatch]);
};

export default useGetPublicCompanies;