import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import projectService from "./projectService";


export const fetchProjectData = createAsyncThunk(
    '/api/project',
    async (_, thunkAPI) => {
        try{
            return projectService.getProject()
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

const projectSlice = createSlice({
    name: 'projects',
    initialState :{
        projectData : [],
        projectLoading: false,
        projectError: null
    },
    extraReducers: (builder) => {
        // console.log(fetchTaskData)
        builder
        .addCase(fetchProjectData.pending, (state) => {
            state.projectLoading = true;
            state.projectError = null;
          })
        .addCase(fetchProjectData.fulfilled, (state, action) => {
        state.projectLoading = false;
        state.projectData = action.payload?.result;
        })
        .addCase(fetchProjectData.rejected, (state, action) => {
        
            state.projectLoading = false;
            state.projectError = action.error.message;
        });
    }
})

export default projectSlice.reducer