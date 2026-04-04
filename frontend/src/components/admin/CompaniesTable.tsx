import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react' // 🟢 Trash2 icon add kiya
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

interface Company {
    _id?: string; 
    id?: string;  
    name: string;
    logo?: string;
    createdAt: string;
}

interface RootState {
    company: {
        companies: Company[];
        searchCompanyByText: string;
    }
}

const CompaniesTable: React.FC = () => {
    const { companies = [], searchCompanyByText = "" } = useSelector((store: RootState) => store.company || {});
    const [filterCompany, setFilterCompany] = useState<Company[]>([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const filtered = companies.filter((company) => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filtered);
    }, [companies, searchCompanyByText]);

    // 🟢 Delete Handler Logic
    const deleteHandler = async (companyId: string) => {
        if (!window.confirm("Are you sure you want to delete this company?")) return;

        try {
            const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                // Note: Aapko yahan Redux store ko bhi update karna chahiye 
                // taaki UI se row bina refresh ke hat jaye.
                // dispatch(removeCompany(companyId)); 
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    }

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
                <TableCaption className="pb-4">A list of your registered companies</TableCaption>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-[80px]">Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterCompany.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                                No companies found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filterCompany.map((company) => {
                            const companyId = company._id || company.id;

                            return (
                                <TableRow key={companyId || Math.random()} className="group hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <Avatar className="border h-9 w-9">
                                            <AvatarImage src={company.logo} alt={company.name} />
                                            <AvatarFallback>{company.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-semibold text-foreground">{company.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{company.createdAt?.split("T")[0] || "N/A"}</TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="p-2 hover:bg-muted rounded-full outline-none transition-all">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-1.5" align="end">
                                                {/* Edit Option */}
                                                <div 
                                                    onClick={() => companyId && navigate(`/admin/companies/${companyId}`)} 
                                                    className='flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-md cursor-pointer transition-colors'
                                                >
                                                    <Edit2 className='w-4 h-4' />
                                                    <span>Edit</span>
                                                </div>

                                                {/* 🟢 Delete Option */}
                                                <div 
                                                    onClick={() => companyId && deleteHandler(companyId)} 
                                                    className='flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-red-50 text-red-600 rounded-md cursor-pointer transition-colors mt-1'
                                                >
                                                    <Trash2 className='w-4 h-4' />
                                                    <span>Delete</span>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export default CompaniesTable;
