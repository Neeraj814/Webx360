import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useSelector, useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice' 
import { toast } from 'sonner'
import useGetCompanyById from '@/hooks/useGetCompanyById' 

const CompanySetup = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useGetCompanyById(params.id); 

    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: null 
            });
        }
    }, [singleCompany]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

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
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Internal Server Error (500)");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='max-w-xl mx-auto my-10 p-8 border rounded-lg shadow-lg'>
            <form onSubmit={submitHandler}>
                <div className='flex items-center gap-5 p-4'>
                    <button onClick={() => navigate("/admin/companies")} className="flex items-center gap-2 text-gray-500 font-semibold">
                        <span>Back</span>
                    </button>
                    <h1 className='font-bold text-xl'>Company Setup</h1>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label>Company Name</label>
                        <input type="text" name="name" value={input.name} onChange={changeEventHandler} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label>Description</label>
                        <input type="text" name="description" value={input.description} onChange={changeEventHandler} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label>Website</label>
                        <input type="text" name="website" value={input.website} onChange={changeEventHandler} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label>Location</label>
                        <input type="text" name="location" value={input.location} onChange={changeEventHandler} className="w-full border p-2 rounded" />
                    </div>
                    <div className='col-span-2'>
                        <label>Logo File</label>
                        <input type="file" accept="image/*" onChange={changeFileHandler} className="w-full border p-2 rounded" />
                    </div>
                </div>
                <button type="submit" disabled={loading} className='w-full mt-8 bg-black text-white p-2 rounded hover:bg-gray-800'>
                    {loading ? "Updating..." : "Update"}
                </button>
            </form>
        </div>
    )
}

export default CompanySetup;
