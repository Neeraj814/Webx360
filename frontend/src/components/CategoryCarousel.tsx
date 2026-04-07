import React from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './ui/carousel';

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "FullStack Developer",
  "Next.js Developer",
  "Mobile App Dev",
  "DevOps Engineer"
];

const CategoryCarousel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchJobHandler = (query: string) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-16 px-4 relative">

      {/* 🔥 Gradient Fade Edges */}
      <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="relative"
      >
        {/* Carousel Content */}
        <CarouselContent className="flex gap-3 cursor-grab active:cursor-grabbing">
          {categories.map((cat, index) => (
            <CarouselItem
              key={index}
              className="basis-auto"
            >
              <Button
                onClick={() => searchJobHandler(cat)}
                variant="outline"
                className="rounded-full font-medium border border-slate-200 
                                hover:border-[#6A38C2] hover:text-[#6A38C2] 
                                transition-all duration-200 shadow-sm 
                                px-5 py-2 whitespace-nowrap bg-white"
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/*  Navigation Arrows */}
        <CarouselPrevious
          className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 
  h-10 w-10 rounded-full border border-slate-200 
  bg-white text-slate-600 shadow-md `
  hover:bg-[#6A38C2] hover:text-white 
  transition-all duration-200 z-20 [&>span]:hidden"
        />

        <CarouselNext
          className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 
  h-10 w-10 rounded-full border border-slate-200 
  bg-white text-slate-600 shadow-md 
  hover:bg-[#6A38C2] hover:text-white 
  transition-all duration-200 z-20 [&>span]:hidden"
        />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
