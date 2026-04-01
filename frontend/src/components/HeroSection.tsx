import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';


// Define the shape of your Redux Store (RootState)
interface RootState {
    auth: {
        user: {
            role: string;
            // add other user properties if needed, e.g., fullname: string;
        } | null;
    };
}

const HeroSection: React.FC = () => {
    const [query, setQuery] = useState<string>("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get user from Redux with Type Safety
    const { user } = useSelector((store: RootState) => store.auth);

    const searchJobHandler = (): void => {
        dispatch(setSearchedQuery(query));
        
        // Dynamic navigation based on role
        if (user?.role === 'recruiter') {
            navigate("/admin/jobs");
        } else {
            navigate("/browse");
        }
    };

    // Handle Enter Key Press
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            searchJobHandler();
        }
    };

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                {/* Adaptive Badge */}
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium transition-all'>
                    {user?.role === 'recruiter' ? "Recruiter Dashboard" : "No. 1 Job Hunt Website"}
                </span>

                {/* Adaptive Heading */}
                <h1 className='text-5xl font-bold leading-tight'>
                    {user?.role === 'recruiter' ? "Search, Manage &" : "Search, Apply &"} <br /> 
                    Get Your <span className='text-[#6A38C2]'>
                        {user?.role === 'recruiter' ? "Top Talent" : "Dream Jobs"}
                    </span>
                </h1>

                {/* Adaptive Paragraph */}
                <p className='text-gray-500 max-w-lg mx-auto'>
                    {user?.role === 'recruiter' 
                        ? "Streamline your hiring process with Webx. Connect with verified professionals instantly."
                        : "Browse thousands of curated job listings. Your next big career move is just a click away."}
                </p>

                {/* Search Bar */}
                <div className='flex w-[90%] md:w-[40%] shadow-lg border border-gray-200 pl-4 rounded-full items-center gap-4 mx-auto bg-white overflow-hidden'>
                    <input
                        type="text"
                        placeholder={user?.role === 'recruiter' ? 'Search candidates by skill...' : 'Find your dream jobs'}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className='outline-none border-none w-full text-sm py-3'
                    />
                    <Button 
                        onClick={searchJobHandler} 
                        className="rounded-r-full bg-[#6A38C2] hover:bg-[#5b30a6] h-full px-6 transition-colors"
                    >
                        <Search className='h-5 w-5 text-white' />
                        
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;