import React, { useEffect, useState } from 'react'
import ApplicantsTable from './ApplicantsTable'
import Navbar from "@/components/shared/Navbar";
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'
import { Loader2, Users } from 'lucide-react'

const Applicants: React.FC = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { applicants } = useSelector((store: any) => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllApplicants(res.data.job));
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchAllApplicants();
    }, [params.id, dispatch]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className='max-w-7xl mx-auto px-6 py-8'>
                <div className='flex items-center gap-3 mb-8'>
                    <div className='bg-primary/10 p-2 rounded-lg'>
                        <Users className='h-6 w-6 text-primary' />
                    </div>
                    <div>
                        <h1 className='font-heading text-2xl font-bold text-foreground'>
                            Applicants List
                        </h1>
                        <p className='text-sm text-muted-foreground'>
                            Total {applicants?.applications?.length || 0} candidates applied for this position
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className='flex flex-col items-center justify-center py-20'>
                        <Loader2 className='h-10 w-10 animate-spin text-primary mb-4' />
                        <p className='text-muted-foreground animate-pulse'>Fetching candidate profiles...</p>
                    </div>
                ) : (
                    <div className='bg-card border rounded-xl shadow-sm'>
                        <ApplicantsTable />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Applicants;