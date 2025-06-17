import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';
import checkUserIsLoggedIn from "../../utils/auth";
import authService from "./authService";

const secret = 'FSDTT@2025'; // This is your shared secret
const algorithm = 'HS256'; // Example: HMAC SHA-256

export const loginUser = createAsyncThunk(
    '/api/login',
    async (credentials, thunkAPI) => {
        try {
            return authService.login(credentials)
        } catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)
const initialState  = {
    user: checkUserIsLoggedIn(),
    token: null,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            // console.log('asdfkasjkd')
            state.user = action.payload?.user
            state.token = action.payload?.token
        },
        logout : (state) => {
            return initialState
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.token = action?.payload?.result?.token
            state.user = jwtDecode(action?.payload?.result?.token);
            localStorage.setItem('token', action?.payload?.result?.token)
          })
          .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Login failed';
          });
    },
})


export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;