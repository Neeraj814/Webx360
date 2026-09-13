import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'sonner'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import Navbar from '@/components/shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { ArrowLeft, Loader2, Building2 } from 'lucide-react'

const CompanySetup = () => {
    const params = useParams();
    const navigate = useNavigate();

    useGetCompanyById(params.id);

    const { singleCompany } = useSelector((store: any) => store.company);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null as File | null
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
            setPreview(singleCompany.logo || null);
        }
    }, [singleCompany]);

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, file });
            setPreview(URL.createObjectURL(file));
        }
    }

    const submitHandler = async (e: React.FormEvent) => {
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
        } catch (error: any) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-muted/40">
            <Navbar />
            <div className='max-w-3xl mx-auto my-10 px-4'>
                <button onClick={() => navigate("/admin/companies")} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    Back to companies
                </button>

                <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
                    <div className="flex items-center gap-2 mb-6 border-b border-border pb-5">
                        <Building2 className="text-primary h-5 w-5" />
                        <h1 className='font-display text-2xl font-semibold text-foreground'>Company setup</h1>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="flex items-center gap-5">
                            <Avatar className="h-16 w-16 rounded-xl border border-border">
                                <AvatarImage src={preview || undefined} className="object-cover" />
                                <AvatarFallback className="rounded-xl">{input.name?.charAt(0) || "C"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Label className="font-semibold">Logo</Label>
                                <Input type="file" accept="image/*" onChange={changeFileHandler} className="mt-1.5 cursor-pointer text-xs" />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                            <div className="space-y-1.5">
                                <Label className="font-semibold">Company name</Label>
                                <Input name="name" value={input.name} onChange={changeEventHandler} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-semibold">Website</Label>
                                <Input name="website" value={input.website} onChange={changeEventHandler} placeholder="https://" />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <Label className="font-semibold">Description</Label>
                                <Input name="description" value={input.description} onChange={changeEventHandler} placeholder="What does this company do?" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-semibold">Location</Label>
                                <Input name="location" value={input.location} onChange={changeEventHandler} placeholder="e.g. Bangalore" />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className='w-full h-11 font-semibold'>
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                                "Save changes"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CompanySetup;
