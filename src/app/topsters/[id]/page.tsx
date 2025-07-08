'use client'

import React from 'react'
import { useGetTopster } from '@/hooks/use-topster'


const TopsterDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)
    const { data: topster, isLoading } = useGetTopster(id)
    console.log('topster', topster)
    if (isLoading) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <h1>Topster Detail Page</h1>
            <p>Topster ID: {id}</p>
            {/* 여기에 Topster 상세 정보를 표시하는 컴포넌트를 추가할 수 있습니다. */}
        </div>
    )
}

export default TopsterDetailPage