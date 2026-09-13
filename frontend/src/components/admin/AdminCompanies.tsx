import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import CompaniesTable from './CompaniesTable'
import useGetAdminCompanies from '@/hooks/useGetAdminCompanies'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Search, Plus } from 'lucide-react'

const AdminCompanies = () => {
    useGetAdminCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companies } = useSelector((store: any) => store.company);

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input]);

    return (
        <div className="min-h-screen bg-muted/40">
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="font-display text-3xl font-semibold text-foreground">Companies</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {companies?.length || 0} {companies?.length === 1 ? "company" : "companies"} registered
                        </p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="w-64 pl-9"
                                placeholder="Filter by name"
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => navigate("/admin/companies/create")} className="gap-2 font-semibold">
                            <Plus className="h-4 w-4" /> New company
                        </Button>
                    </div>
                </div>
                <CompaniesTable />
            </div>
        </div>
    )
}

export default AdminCompanies
