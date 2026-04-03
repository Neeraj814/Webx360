import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// 1. Define the Company Interface
interface Company {
    _id: string;
    name: string;
    logo?: string;
    createdAt: string;
}

// 2. Define RootState for Redux (Make sure 'company' matches your store key)
interface RootState {
    company: {
        companies: Company[];
        searchCompanyByText: string;
    }
}

const CompaniesTable: React.FC = () => {
    // Standardize the selector to prevent "undefined" errors
    const { companies = [], searchCompanyByText = "" } = useSelector((store: RootState) => store.company || {});
    const [filterCompany, setFilterCompany] = useState<Company[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Optimization: If no search text, show all companies immediately
        if (!searchCompanyByText.trim()) {
            setFilterCompany(companies);
            return;
        }

        const filtered = companies.filter((company) => {
            const name = company?.name?.toLowerCase() || "";
            return name.includes(searchCompanyByText.toLowerCase());
        });

        setFilterCompany(filtered);
    }, [companies, searchCompanyByText]);

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
                <TableCaption className="pb-4">A list of your recently registered companies</TableCaption>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
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
                                No companies found. Please register a company first.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filterCompany.map((company) => (
                            <TableRow key={company._id} className="group hover:bg-muted/30 transition-colors">
                                <TableCell>
                                    <Avatar className="border h-9 w-9">
                                        <AvatarImage src={company.logo} alt={company.name} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                            {company.name ? company.name.charAt(0).toUpperCase() : "C"}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-semibold text-foreground">
                                    {company.name || "Unnamed Company"}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {company.createdAt ? company.createdAt.split("T")[0] : "N/A"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="p-2 hover:bg-muted rounded-full transition-all outline-none">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 p-1.5" align="end">
                                            <div 
                                                onClick={() => navigate(`/admin/companies/${company._id}`)} 
                                                className='flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-md cursor-pointer transition-colors'
                                            >
                                                <Edit2 className='w-4 h-4' />
                                                <span>Edit</span>
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

export default CompaniesTable;
