import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal, FileText, CheckCircle2, XCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'

const statusStyles: Record<string, string> = {
    pending: "bg-warning/10 text-warning border-warning/20",
    accepted: "bg-success/10 text-success border-success/20",
    rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const ApplicantsTable: React.FC = () => {
    const { applicants } = useSelector((store: any) => store.application);

    const statusHandler = async (status: string, id: string) => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    }

    const applications = applicants?.applications || [];

    return (
        <div className='rounded-xl overflow-hidden'>
            <Table>
                <TableCaption className="pb-4 text-xs">A list of everyone who applied to this role</TableCaption>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-semibold text-foreground">Candidate</TableHead>
                        <TableHead className="font-semibold text-foreground">Contact</TableHead>
                        <TableHead className="font-semibold text-foreground">Resume</TableHead>
                        <TableHead className="font-semibold text-foreground">Applied</TableHead>
                        <TableHead className="font-semibold text-foreground">Status</TableHead>
                        <TableHead className="text-right font-semibold text-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                                No one has applied to this role yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        applications.map((item: any) => {
                            const status = (item.status || "pending").toLowerCase();
                            return (
                                <TableRow key={item._id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                    {item?.applicant?.fullname?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-foreground text-sm">{item?.applicant?.fullname}</p>
                                                <p className="text-xs text-muted-foreground">{item?.applicant?.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{item?.applicant?.phoneNumber}</TableCell>
                                    <TableCell>
                                        {item.applicant?.profile?.resume ? (
                                            <a
                                                className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
                                                href={item?.applicant?.profile?.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FileText className="h-3.5 w-3.5" />
                                                Resume
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">Not provided</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{item?.createdAt?.split("T")[0]}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`capitalize font-semibold ${statusStyles[status] || statusStyles.pending}`}>
                                            {status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="p-2 rounded-full hover:bg-muted transition-colors outline-none">
                                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-1.5" align="end">
                                                <div
                                                    onClick={() => statusHandler("Accepted", item?._id)}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-success/10 hover:text-success rounded-md cursor-pointer transition-colors"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" /> Accept
                                                </div>
                                                <div
                                                    onClick={() => statusHandler("Rejected", item?._id)}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-destructive/10 hover:text-destructive rounded-md cursor-pointer transition-colors mt-1"
                                                >
                                                    <XCircle className="h-4 w-4" /> Reject
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
    )
}

export default ApplicantsTable;

