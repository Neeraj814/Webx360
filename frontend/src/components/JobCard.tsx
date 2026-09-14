    import React from 'react'
    import { Button } from '@/components/ui/button'
    import { Bookmark, MapPin, Briefcase, IndianRupee, Clock } from 'lucide-react'
    import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
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
            <div className='group relative flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5'>

                <div>
                    {/* TOP BAR: Time & Bookmark */}
                    <div className='mb-3 flex items-center justify-between'>
                        <div className='flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
                            <Clock className='h-3 w-3' />
                            <span>{daysAgo === 0 ? "Today" : `${daysAgo}d ago`}</span>
                        </div>
                        <Button variant="ghost" className="h-8 w-8 rounded-full p-0 hover:bg-primary/10 hover:text-primary" size="sm">
                            <Bookmark className='h-4 w-4' />
                        </Button>
                    </div>

                    {/* COMPANY & TITLE */}
                    <div className='mb-3 flex items-start gap-3'>
                        <Avatar className='h-10 w-10 rounded-lg border border-border'>
                            <AvatarImage src={job?.company?.logo} />
                            <AvatarFallback className="rounded-lg text-xs">{job?.company?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className='overflow-hidden'>
                            <h1
                                className='cursor-pointer truncate font-display text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary'
                                onClick={() => navigate(`/description/${job?._id}`)}
                            >
                                {job?.title}
                            </h1>
                            <p className='truncate text-xs font-medium text-muted-foreground'>{job?.company?.name}</p>
                        </div>
                    </div>

                    {/* LOCATION & STATS */}
                    <div className='mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                            <MapPin className='h-3 w-3' />
                            <span>{job?.location}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Briefcase className='h-3 w-3' />
                            <span>{job?.jobType}</span>
                        </div>
                        <div className='flex items-center gap-1 font-semibold text-success'>
                            <IndianRupee className='h-3 w-3' />
                            <span>{job?.salary} LPA</span>
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <p className='mb-4 line-clamp-2 text-[13px] leading-snug text-muted-foreground'>
                        {job?.description}
                    </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className='flex items-center gap-2 border-t border-border pt-3'>
                    <Button
                        onClick={() => navigate(`/description/${job?._id}`)}
                        variant="outline"
                        className="h-8 flex-1 rounded-lg text-xs font-semibold"
                        size="sm"
                    >
                        Details
                    </Button>
                    <Button
                        onClick={() => navigate(`/description/${job?._id}`)}
                        className="h-8 flex-1 rounded-lg text-xs font-semibold shadow-sm"
                        size="sm"
                    >
                        Apply
                    </Button>
                </div>
            </div>
        )
    }

    export default JobCard
