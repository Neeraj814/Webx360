import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// 1. Updated Interface to handle both _id and id
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

    useEffect(() => {
        const filtered = companies.filter((company) => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filtered);
    }, [companies, searchCompanyByText]);

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
                <TableCaption className="pb-4">A list of your recently registered companies</TableCaption>
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
                            // 🟢 FIX: Extracting the correct ID
                            const companyId = company._id || company.id;

                            return (
                                <TableRow key={companyId || Math.random()} className="group hover:bg-muted/30">
                                    <TableCell>
                                        <Avatar className="border h-9 w-9">
                                            <AvatarImage src={company.logo} alt={company.name} />
                                            <AvatarFallback>{company.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-semibold">{company.name}</TableCell>
                                    <TableCell>{company.createdAt?.split("T")[0] || "N/A"}</TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="p-2 hover:bg-muted rounded-full outline-none">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-32 p-1.5" align="end">
                                                <div 
                                                    onClick={() => {
                                                        // 🟢 FIX: Only navigate if companyId exists
                                                        if (companyId) {
                                                            navigate(`/admin/companies/${companyId}`);
                                                        } else {
                                                            console.error("ID missing for company:", company);
                                                        }
                                                    }} 
                                                    className='flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-md cursor-pointer'
                                                >
                                                    <Edit2 className='w-4 h-4' />
                                                    <span>Edit</span>
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
