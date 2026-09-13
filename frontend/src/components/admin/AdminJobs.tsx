import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { Search, Plus } from 'lucide-react'

const AdminJobs: React.FC = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allAdminJobs } = useSelector((store: any) => store.job);

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <div className='max-w-6xl mx-auto my-10 px-4'>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">Job postings</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {allAdminJobs?.length || 0} {allAdminJobs?.length === 1 ? "role" : "roles"} posted
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="w-64 pl-9"
                placeholder="Filter by role or company"
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate("/admin/jobs/create")} className="gap-2 font-semibold">
              <Plus className="h-4 w-4" /> New job
            </Button>
          </div>
        </div>
        <AdminJobsTable />
      </div>
    </div>
  )
}

export default AdminJobs;
