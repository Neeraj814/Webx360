import React, { useState } from 'react'
import Navbar from "@/components/shared/Navbar";
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2, BriefcaseIcon, LinkIcon, LayoutGrid } from 'lucide-react' 
import useGetAllAdminCompanies from '@/hooks/useGetAdminCompanies'; 

const PostJob: React.FC = () => {
    useGetAllAdminCompanies();

    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: "",
        jobWebsite: "",
        category: "" 
    });

    const jobCategories = ["Engineering", "Design", "Marketing", "Data Science", "Sales", "Finance"];
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector((store: any) => store.company);

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value: string) => {
        setInput({ ...input, companyId: value });
    };

    const categoryChangeHandler = (value: string) => {
        setInput({ ...input, category: value });
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.companyId) return toast.error("Please select a company");
        if (!input.category) return toast.error("Please select a category");

        try {
            setLoading(true);
            
            const payload = {
                ...input,
                position: Number(input.position),
            };

            const res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className='flex items-center justify-center w-full py-10 px-4'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl w-full border border-border shadow-sm rounded-xl bg-card'>
                    <div className="flex items-center gap-2 mb-6 border-b pb-4">
                        <BriefcaseIcon className="text-primary h-6 w-6" />
                        <h1 className="font-heading text-2xl font-bold">Post New Opportunity</h1>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className="space-y-1">
                            <Label className="font-semibold">Job Title</Label>
                            <Input placeholder="e.g. Senior Frontend Developer" type="text" name="title" value={input.title} onChange={changeEventHandler} className="focus-visible:ring-primary" />
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <LayoutGrid className="h-4 w-4 text-primary" />
                                <Label className="font-semibold">Job Category</Label>
                            </div>
                            <Select onValueChange={categoryChangeHandler}>
                                <SelectTrigger className="w-full focus-visible:ring-primary">
                                    <SelectValue placeholder="Select Field" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {jobCategories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label className="font-semibold">Description</Label>
                            <Input placeholder="Briefly describe the role" type="text" name="description" value={input.description} onChange={changeEventHandler} className="focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-1">
                            <Label className="font-semibold">Requirements (Skills)</Label>
                            <Input placeholder="React, Node.js, Tailwind..." type="text" name="requirements" value={input.requirements} onChange={changeEventHandler} className="focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-1">
                            <Label className="font-semibold">Salary (LPA)</Label>
                            <Input placeholder="e.g. 12" type="text" name="salary" value={input.salary} onChange={changeEventHandler} className="focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-1">
                            <Label className="font-semibold">Location</Label>
                            <Input placeholder="e.g. Remote, Bangalore" type="text" name="location" value={input.location} onChange={changeEventHandler} className="focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-1">
                            <Label className="font-semibold">Job Type</Label>
                            <Input placeholder="e.g. Full-time, Internship" type="text" name="jobType" value={input.jobType} onChange={changeEventHandler} className="focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-1">
                            <Label className="font-semibold">Experience Level (Years)</Label>
                            <Input placeholder="e.g. 2" type="number" name="experience" value={input.experience} onChange={changeEventHandler} className="focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-1">
                            <Label className="font-semibold">No. of Positions</Label>
                            <Input type="number" name="position" value={input.position} onChange={changeEventHandler} className="focus-visible:ring-primary" />
                        </div>

                        <div className="space-y-1 md:col-span-2 border-t pt-4 mt-2">
                            <div className="flex items-center gap-2 mb-1">
                                <LinkIcon className="h-4 w-4 text-primary" />
                                <Label className="font-semibold">External Application Link (Optional)</Label>
                            </div>
                            <Input
                                placeholder="Please provide your company website"
                                type="text"
                                name="jobWebsite"
                                value={input.jobWebsite}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-primary bg-primary/5"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <Label className="font-semibold block mb-2">Select Company</Label>
                        {companies.length > 0 ? (
                            <Select onValueChange={selectChangeHandler}>
                                <SelectTrigger className="w-full md:w-[280px]">
                                    <SelectValue placeholder="Which company is hiring?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {companies.map((company: any) => (
                                            <SelectItem key={company._id} value={company._id}>
                                                {company.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        ) : (
                            <p className='text-sm text-destructive font-medium'>
                                *No companies found. Register a company first.
                            </p>
                        )}
                    </div>

                    {loading ? (
                        <Button disabled className="w-full mt-8">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Posting Job...
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={companies.length === 0}
                            className="w-full mt-8 text-lg h-12 font-bold"
                        >
                            Publish Job
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default PostJob;
