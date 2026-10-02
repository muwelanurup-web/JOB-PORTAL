import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Button } from '../ui/button';
import { updateApplicantStatus } from '@/redux/applicationSlice';

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();
    const [updatingId, setUpdatingId] = useState(null);

    const statusHandler = async (status, id) => {
        try {
            setUpdatingId(id);
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${id}/update`,
                { status },
                { withCredentials: true }
            );
            if (res.data.success) {
                dispatch(updateApplicantStatus({ applicationId: id, status: status.toLowerCase() }));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update application status.");
        } finally {
            setUpdatingId(null);
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Decision</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell >
                                    {
                                        item.applicant?.profile?.resume ? <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a> : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.applicant?.createdAt?.split("T")[0] || "NA"}</TableCell>
                                <TableCell className="capitalize">{item?.status || "pending"}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            disabled={updatingId === item?._id}
                                            className="bg-emerald-700 text-white hover:bg-emerald-800"
                                            onClick={() => statusHandler("Accepted", item?._id)}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            disabled={updatingId === item?._id}
                                            onClick={() => statusHandler("Rejected", item?._id)}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </TableCell>

                            </tr>
                        ))
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable