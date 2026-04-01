import React from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark, MapPin, Briefcase, IndianRupee, Clock } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'

const JobCard = ({ job }: { job: any }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime: any) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime.getTime() - createdAt.getTime();
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    }

    const daysAgo = daysAgoFunction(job?.createdAt);

    return (
        <div className='p-4 rounded-xl shadow-sm bg-white border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-200 group relative flex flex-col justify-between h-full'>
            
            <div>
                {/* TOP BAR: Time & Bookmark */}
                <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tight text-gray-400'>
                        <Clock className='h-3 w-3' />
                        <span>{daysAgo === 0 ? "Today" : `${daysAgo}d ago`}</span>
                    </div>
                    <Button variant="ghost" className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500 p-0" size="sm">
                        <Bookmark className='h-4 w-4' />
                    </Button>
                </div>

                {/* COMPANY & TITLE */}
                <div className='flex items-start gap-3 mb-3'>
                    <Avatar className='h-10 w-10 border rounded-lg'>
                        <AvatarImage src={job?.company?.logo} />
                        <AvatarFallback className="text-xs">{job?.company?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className='overflow-hidden'>
                        <h1 className='font-bold text-base text-gray-900 leading-tight truncate group-hover:text-primary transition-colors' 
                            onClick={() => navigate(`/description/${job?._id}`)}>
                            {job?.title}
                        </h1>
                        <p className='text-xs text-gray-500 font-medium truncate'>{job?.company?.name}</p>
                    </div>
                </div>

                {/* LOCATION & STATS (Inline) */}
                <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500 mb-3'>
                    <div className='flex items-center gap-1'>
                        <MapPin className='h-3 w-3 text-gray-400' />
                        <span>{job?.location}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Briefcase className='h-3 w-3 text-gray-400' />
                        <span>{job?.jobType}</span>
                    </div>
                    <div className='flex items-center gap-1 font-bold text-green-600'>
                        <IndianRupee className='h-3 w-3' />
                        <span>{job?.salary} LPA</span>
                    </div>
                </div>

                {/* DESCRIPTION (Compact) */}
                <p className='text-[13px] text-gray-600 line-clamp-2 leading-snug mb-4'>
                    {job?.description}
                </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className='flex items-center gap-2 pt-3 border-t border-gray-50'>
                <Button 
                    onClick={() => navigate(`/description/${job?._id}`)} 
                    variant="outline"
                    className="flex-1 h-8 text-xs font-bold rounded-lg"
                    size="sm"
                >
                    Details
                </Button>
                <Button 
                    onClick={() => navigate(`/description/${job?._id}`)}
                    className="flex-1 h-8 text-xs font-bold rounded-lg bg-primary hover:bg-primary/90 text-white shadow-sm"
                    size="sm"
                >
                    Apply
                </Button>
            </div>
        </div>
    )
}

export default JobCard