import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

const CompanySetup = () => {
    const params = useParams(); // 🟢 URL se ID nikalne ke liye
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const { singleCompany } = useSelector(store => store.company);
    const navigate = useNavigate();

    // 🟢 MySQL ID logic: singleCompany.id (not _id)
    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: singleCompany.file || null
            });
        }
    }, [singleCompany]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            // 🟢 CRITICAL FIX: Ensure params.id is used here
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        }
    }

    return (
        // Aapka JSX yahan aayega...
        <form onSubmit={submitHandler}>
            {/* Input fields */}
            <button type="submit">Update</button>
        </form>
    )
}

export default CompanySetup;
