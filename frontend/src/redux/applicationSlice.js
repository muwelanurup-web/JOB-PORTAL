import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name:'application',
    initialState:{
        applicants:null,
    },
    reducers:{
        setAllApplicants:(state,action) => {
            state.applicants = action.payload;
        },
        updateApplicantStatus:(state, action) => {
            const application = state.applicants?.applications?.find(
                (item) => item._id === action.payload.applicationId
            );
            if (application) {
                application.status = action.payload.status;
            }
        }
    }
});
export const {setAllApplicants, updateApplicantStatus} = applicationSlice.actions;
export default applicationSlice.reducer;