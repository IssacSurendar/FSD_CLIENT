import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../utils/config'

export const fetchTaskData = createAsyncThunk(
    '/api/task',
    async (_, thunkAPI) => {
        try{
            const response = await axios.get('/api/task')
            return response.data
        }catch(error){
            // console.log("asdjhasjhdjk",error?.response)
            return error.response?.data
        }
    }
)

const taskSlice = createSlice({
    name: 'tasks',
    initialState :{
        taskData : [],
        taskLoading: false,
        taskError: null
    },
    extraReducers: (builder) => {
        // console.log(fetchTaskData)
        builder
        .addCase(fetchTaskData.pending, (state) => {
            state.taskLoading = true;
            state.taskError = null;
          })
        .addCase(fetchTaskData.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.taskData = action.payload?.result;
        })
        .addCase(fetchTaskData.rejected, (state, action) => {
            console.log('rejjjje')
            state.taskLoading = false;
            state.taskError = action.error.message;
        });
    }
})

export default taskSlice.reducer