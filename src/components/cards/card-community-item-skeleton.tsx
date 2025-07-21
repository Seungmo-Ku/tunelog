import React from 'react'


export const CardCommunityItemSkeleton = ({ ...props }) => {
    return (
        <div
            {...props}
            className='flex flex-col w-full overflow-hidden bg-white rounded-lg shadow-md shrink-0'
        >
            {/* Image Skeleton */}
            <div className='w-full h-48 bg-gray-300 animate-pulse'/>
            
            {/* Content Skeleton */}
            <div className='flex flex-col flex-grow p-4 bg-tunelog-dark-alt'>
                {/* Type Skeleton */}
                <div className='w-20 h-5 mb-2 bg-gray-700 rounded-md animate-pulse'/>
                {/* Title Skeleton */}
                <div className='w-4/5 h-7 mb-4 bg-gray-700 rounded-md animate-pulse'/>
                {/* Content lines skeleton */}
                <div className='space-y-2'>
                    <div className='w-full h-4 bg-gray-700 rounded-md animate-pulse'/>
                    <div className='w-full h-4 bg-gray-700 rounded-md animate-pulse'/>
                    <div className='w-2/3 h-4 bg-gray-700 rounded-md animate-pulse'/>
                </div>
            </div>
            
            {/* Footer Skeleton */}
            <div className='px-4 py-3 bg-tunelog-dark'>
                <div className='flex items-center justify-between'>
                    {/* Author Skeleton */}
                    <div className='w-1/3 h-5 bg-gray-600 rounded-md animate-pulse'/>
                    {/* Date Skeleton */}
                    <div className='w-1/4 h-5 bg-gray-600 rounded-md animate-pulse'/>
                </div>
            </div>
        </div>
    )
}
