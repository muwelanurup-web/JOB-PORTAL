import React from 'react'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=> navigate(`/description/${job._id}`)} className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'>
            <div className='flex items-center gap-3'>
                <Avatar className="h-10 w-10">
                    <AvatarImage src={job?.company?.logo} alt={`${job?.company?.name || "Company"} logo`} />
                    <AvatarFallback>{job?.company?.name?.charAt(0)?.toUpperCase() || "C"}</AvatarFallback>
                </Avatar>
                <div className='min-w-0'>
                    <h1 className='truncate font-medium text-lg'>{job?.company?.name || "Company"}</h1>
                    <p className='text-sm text-gray-500'>{job?.company?.location || job?.location || "Location not specified"}</p>
                </div>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>

        </div>
    )
}

export default LatestJobCards