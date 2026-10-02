import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { toast } from 'sonner';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const {applicants} = useSelector(store=>store.application);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                if (!res.data.success || !res.data.job) {
                    throw new Error(res.data.message || "Unable to load applicants.");
                }
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                toast.error(error.response?.data?.message || error.message || "Unable to load applicants.");
            } finally {
                setLoading(false);
            }
        }
        fetchAllApplicants();
    }, [dispatch, params.id]);
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>Applicants ({applicants?.applications?.length || 0})</h1>
                {loading ? <p>Loading applicants...</p> : applicants?.applications?.length ? <ApplicantsTable /> : <p>No applicants have applied to this job yet.</p>}
            </div>
        </div>
    )
}

export default Applicants