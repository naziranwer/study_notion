import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    token : localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null
}

const authSlice = createSlice({
    name:"Auth",
    initialState:initialState,
    reducers:{
        setSignUpData:(state,action)=>{
            state.signUpData = action.payload
        },
        setLoading : (state,action)=>{
            state.loading = action.payload
        },
        setToken : (state,action)=>{
            state.token = action.payload
        }
    }
})
export const {setSignUpData,setLoading,setToken} = authSlice.actions;
export default authSlice.reducer