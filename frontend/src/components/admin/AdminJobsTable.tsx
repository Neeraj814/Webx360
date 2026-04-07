import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Calendar, Trash2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/badge'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setAllAdminJobs } from '@/redux/jobSlice'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'

const MySwal = withReactContent(Swal)

const AdminJobsTable: React.FC = () => {
    useGetAllAdminJobs(); 

    const { allAdminJobs, searchJobByText } = useSelector((store: any) => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const filteredJobs = allAdminJobs?.filter((job: any) => {
            if (!searchJobByText) return true;
            
            
            const companyName = typeof job?.company === 'object' 
                ? job?.company?.name 
                : "Company Name Not Found";

            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || 
                   companyName?.toLowerCase().includes(searchJobByText.toLowerCase());
        });
        setFilterJobs(filteredJobs || []);
    }, [allAdminJobs, searchJobByText]);

    const deleteJobHandler = async (jobId: string, jobTitle: string) => {
        MySwal.fire({
            title: <p className="text-2xl font-bold text-slate-800">Delete Job?</p>,
            html: <p className="text-slate-600">Are you sure you want to remove <b>"{jobTitle}"</b>?</p>,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-3xl border-none shadow-2xl',
                confirmButton: 'rounded-full px-6 py-2 font-semibold',
                cancelButton: 'rounded-full px-6 py-2 font-semibold'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
                        withCredentials: true
                    });
                    
                    if (res.data.success) {
                        toast.success(res.data.message);
                        const updatedAdminJobs = allAdminJobs.filter((job: any) => job._id !== jobId);
                        dispatch(setAllAdminJobs(updatedAdminJobs));
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Failed to delete job");
                }
            }
        });
    }

    return (
        <div className='border rounded-xl bg-card shadow-sm overflow-hidden'>
            <Table>
                <TableCaption className="pb-4 text-xs font-medium">Manage your active job postings</TableCaption>
                <TableHeader className="bg-muted/50 text-slate-700">
                    <TableRow>
                        <TableHead className="font-bold">Company</TableHead>
                        <TableHead className="font-bold">Role</TableHead>
                        <TableHead className="font-bold">Date Posted</TableHead>
                        <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!filterJobs || filterJobs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-24 text-muted-foreground italic">
                                No matching jobs found...
                            </TableCell>
                        </TableRow>
                    ) : (
                        filterJobs.map((job: any) => (
                            <TableRow key={job._id} className="hover:bg-muted/30 transition-colors group">
                                <TableCell className="font-semibold text-slate-900">
                                    {typeof job?.company === 'object' ? job?.company?.name : "N/A (Not Populated)"}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1">
                                        {job?.title}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    <div className="flex items-center gap-2 font-medium">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {job?.createdAt?.split("T")[0]}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <motion.button 
                                                whileHover={{ scale: 1.1, backgroundColor: '#f1f5f9' }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 rounded-full outline-none transition-all"
                                            >
                                                <MoreHorizontal className="h-5 w-5 text-slate-500" />
                                            </motion.button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-48 p-1.5 shadow-xl border-slate-100 rounded-xl" align="end">
                                            <div 
                                                onClick={() => navigate(`/admin/jobs/${job._id}`)} 
                                                className='flex items-center gap-3 px-3 py-2.5 text-sm font-medium hover:bg-slate-50 rounded-lg cursor-pointer transition-all'
                                            >
                                                <Edit2 className='w-4 h-4 text-blue-500' />
                                                <span>Edit Details</span>
                                            </div>
                                            <div 
                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} 
                                                className='flex items-center gap-3 px-3 py-2.5 mt-0.5 text-sm font-medium hover:bg-slate-50 rounded-lg cursor-pointer transition-all'
                                            >
                                                <Eye className='w-4 h-4 text-emerald-500' />
                                                <span>View Applicants</span>
                                            </div>

                                            <div 
                                                onClick={() => deleteJobHandler(job._id, job.title)} 
                                                className='flex items-center gap-3 px-3 py-2.5 mt-0.5 text-sm font-medium hover:bg-red-50 text-red-600 rounded-lg cursor-pointer transition-all'
                                            >
                                                <Trash2 className='w-4 h-4' />
                                                <span>Remove Job</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable;
