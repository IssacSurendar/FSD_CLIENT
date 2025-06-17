import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";


export const fetchUserData = createAsyncThunk(
    '/api/user',
    async (_, thunkAPI) => {
        try{
            return userService.getUser('')
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

const userSlice = createSlice({
    name: 'users',
    initialState :{
        userData : [],
        userLoading: false,
        userError: null
    },
    extraReducers: (builder) => {
        // console.log(fetchTaskData)
        builder
        .addCase(fetchUserData.pending, (state) => {
            state.userLoading = true;
            state.userError = null;
          })
        .addCase(fetchUserData.fulfilled, (state, action) => {
            state.userLoading = false;
            state.userData = action.payload?.result;
        })
        .addCase(fetchUserData.rejected, (state, action) => {
            state.userLoading = false;
            state.userError = action.error.message;
        });
    }
})

export default userSlice.reducer