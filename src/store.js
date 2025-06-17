import {configureStore} from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice';
import taskReducer from './features/taskSlice'
import projectReducer from './features/project/projectSlice'

let store;
const createAppStore = () => {
    store = configureStore({
        reducer: {
            auth: authReducer,
            task: taskReducer,
            project: projectReducer
        },
    })
    return store;
}
// createAppStore()
export const getStore = () => store;

export default createAppStore;