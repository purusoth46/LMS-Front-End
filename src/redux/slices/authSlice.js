import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";


const initialState = {
        isLoggedIn: localStorage.getItem("isLoggedIn") || false,
        user: JSON.parse(localStorage.getItem("data"))?.data || {},
        role: localStorage.getItem("role") || "",
} 


export const createAccount = createAsyncThunk("/auth/signup", async (data)=>{
    try {
        const responsePromise =  axiosInstance.post("user/register",data);
        toast.promise(responsePromise,{
            loading:"Creating account...",
            success:(res)=>{
                return res.data?.message || "Promise Success , Accout Created";
            },
            error:(err)=>{
                return err?.response?.data?.message || "Promise is rejected , Unable to  Create Account";
            }
        })

        const response = await responsePromise;
        
        return  response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        throw error;
    }
})

export const login = createAsyncThunk('auth/login', async(data)=>{
    try {
        const responsePromise = axiosInstance.post("user/login",data);
        toast.promise(responsePromise,{
            loading:"Logging",
            success:(res)=>{
                return res.data?.message || " Promise Success , error in Handling the promise and LoggedIn  "
            },
            error:(err)=>{
                return err.response?.data?.message || "Promise is rejected in Login"
            }
        })

        console.log("login",(await responsePromise).data);

        return ( await responsePromise).data;

    } catch (error) {
        toast.error(error?.response?.data?.message || "unable to login");
        throw error;
    }
})

export const logout= createAsyncThunk('auth/logout', async ()=>{
    try {
        const responsePromise = axiosInstance.get("user/logout");
        toast.promise(responsePromise,{
            loading:"Loading...",
            success:(res)=>{
                return res.data?.message || "Promise success , LogOut"
            },
            error:(err)=>{
                return err.response?.data?.message || 'Promise rejected Error in Logging Out'
            }
        });

        const response = await responsePromise;
        return response.data;

    } catch (error) {
        toast.error(error?.response?.data?.message || " Unable to LogOut")
        throw error;
    }
})

export const updateProfile = createAsyncThunk('auth/updateProfile' , async(data)=>{
    try {
        const responsePromise = axiosInstance.put(`user/update`,data);
        toast.promise(responsePromise,{
            loading:"Loading...",
            success:(res)=>{
                return res.data?.message || "Promise Success , Profile Updated"
            },
            error:(err)=>{
                return err.response?.data?.message || "Promise rejected , Error in Updating Profile"
            }
        });
        
        return (await responsePromise).data;
    }
        catch (error) {
            toast.error(error?.response?.data?.message || "Unable to Update Profile");
            throw error; // this is important to throw error to handle it in the component where we are using this thunk or use return 
        }
})

export const getUserData = createAsyncThunk('auth/getUserData', async()=>{
    try {
        const responsePromise = axiosInstance.get(`user/profile`);
        toast.promise(responsePromise,{
            loading:"Loading...",
            success:(res)=>{
                return res.data?.message || "Promise Success , User Data"
            },
            error:(err)=>{
                return err.response?.data?.message || "Promise rejected , Error in Getting User Data"
            }
        });
        console.log("getProfile",(await responsePromise));
        return (await responsePromise).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Unable to get User Data");
        throw error;
    }
})

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        // for user login
        .addCase(login.fulfilled,(state,action)=>{
            localStorage.setItem("data",JSON.stringify(action?.payload));
            localStorage.setItem("isLoggedIn",true);
            localStorage.setItem("role",action?.payload?.data?.role);
            state.isLoggedIn=true;
            state.user=action?.payload?.data;
            state.role=action?.payload?.data?.role;
        })
        // for Logout
        .addCase(logout.fulfilled,(state)=>{
            localStorage.clear();
            state.isLoggedIn=false;
            state.user={};
            state.role=''
        })
        // for update Profile
        .addCase(updateProfile.fulfilled,(state,action)=>{
            localStorage.setItem("data",JSON.stringify(action?.payload));
            localStorage.setItem("role",action?.payload?.data?.role);
            localStorage.setItem("isLoggedIn",true);
            state.isLoggedIn=true;
            state.user=action?.payload?.data;
            state.role=action?.payload?.data?.role;
        })
        .addCase(getUserData.fulfilled,(state,action)=>{
            localStorage.setItem("data",JSON.stringify(action?.payload));
            localStorage.setItem("role",action?.payload?.data?.role);
            localStorage.setItem("isLoggedIn",true);
            state.isLoggedIn=true;
            state.user=action?.payload?.data;
            state.role=action?.payload?.data?.role;
        })
    }
});

export default authSlice.reducer; 


