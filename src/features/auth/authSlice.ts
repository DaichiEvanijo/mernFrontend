import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type AuthInitialStateType ={
  username:string| null,
  accessToken:string| null,
  roles:number[],
}
const initialState:AuthInitialStateType = {
  username:null, 
  accessToken:null,
  roles:[]
}

const authSlice = createSlice({
  name:"auth",
  initialState,
  reducers:{
    setAuth:(state, action:PayloadAction<AuthInitialStateType>) =>{
      const { username, accessToken, roles } = action.payload;
      return  {
        ...state,
        username:username,
        accessToken:accessToken,
        roles:roles,
      }
    },
    clearAuth:(state) => {
      return {
        ...state, 
        username:null,
        accessToken:null,
        roles:[],
      }
    }
  }
})

export const selectAuth = (state:RootState) => state.auth

export const {setAuth, clearAuth} = authSlice.actions
export default authSlice.reducer

