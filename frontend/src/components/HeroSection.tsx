import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Search, MapPin } from 'lucide-react';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

interface RootState {
    auth: {
        user: {
            role: string;
        } | null;
    };
}

const HeroSection: React.FC = () => {
    const { user } = useSelector((store: RootState) => store.auth);
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (): void => {
        dispatch(setSearchedQuery(query));
        user?.role === 'recruiter' ? navigate("/admin/jobs") : navigate("/browse");
    };

    return (
        <div className='relative w-full min-h-screen bg-white flex flex-col items-center overflow-hidden'>
            
            {/* --- 1. FOREGROUND CONTENT --- */}
            <div className='relative z-30 w-full pt-16 md:pt-5 pb-4 px-4 flex flex-col items-center'>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='text-center max-w-4xl'
                >
                    <span className='inline-block px-4 py-1.5 rounded-full bg-black/5 text-gray-500 text-[11px] font-semibold mb-6 uppercase tracking-[2px] border border-gray-200'>
                        {user?.role === 'recruiter' ? "Smart Hiring Platform" : "India's Smartest Career Network"}
                    </span>

                    {/* Headline */}
                    <h1 className='text-4xl md:text-6xl font-black text-[#111827] tracking-tighter leading-[1.1] mb-6'>
                        Land Your Dream Job — No Limits
                    </h1>
                    
                    {/* Tagline & Search Bar Area */}
                    <div className='relative z-40'>
                        <p className='text-sm md:text-lg text-500 mb-4 max-w-xl mx-auto font-medium'>
                            Turn Your Skills into Real Opportunities.
                        </p>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className='bg-white/90 backdrop-blur-md shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 p-2 rounded-full flex items-center gap-2 w-full max-w-4xl mx-auto hover:shadow-2xl transition-all'
                        >
                            <div className='flex-[1.2] px-6 flex items-center gap-3 border-r border-gray-100'>
                                <Search className='text-gray-400 w-4 h-5' />
                                <input 
                                    type="text" 
                                    placeholder={user?.role === 'recruiter' ? "Hiring for..." : "Job title or company..."}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className='bg-transparent outline-none w-full py-3 text-sm text-gray-700 font-medium placeholder:text-gray-300'
                                />
                            </div>

                            <div className='hidden sm:flex flex-1 px-6 items-center gap-3'>
                                <MapPin className='text-gray-400 w-4 h-4' />
                                <input 
                                    type="text" 
                                    placeholder="Location" 
                                    className='bg-transparent outline-none w-full py-3 text-sm text-gray-700 font-medium placeholder:text-gray-400'
                                />
                            </div>

                            <Button 
                                onClick={searchJobHandler}
                                className='bg-[#111827] hover:bg-black text-white rounded-full px-10 h-12 font-bold text-sm transition-all active:scale-95'
                            >
                                Search
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* --- 2. ENHANCED BACKGROUND IMAGE AREA --- */}
            <div className='absolute inset-0 z-0 flex items-center md:items-end justify-center pointer-events-none pt-40 md:pt-60'>
                
                {/* Smooth Fade Overlay */}
                <div className='absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white via-white/50 to-transparent z-10' />

                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className='w-full flex justify-center'
                >
                    <img 
                        src={user?.role === 'recruiter' ? "/Recuiter-Home.png" : "/Student-Home.png"} 
                        className='w-full max-w-[1500px] xl:max-w-[1800px] h-auto object-contain origsin-top select-none scale-125 md:scale-110 -mt-20 md:-mt-32 transition-all duration-700'
                        alt="Hero Characters"
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default HeroSection;
