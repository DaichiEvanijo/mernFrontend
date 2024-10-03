import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store"

import { AxiosInstance } from "axios";


type User = {
  _id:string,
  username: string;
  roles: number[];
};
type UserInitialStateType = {
  users:User[],
  status:string,
  error:string
}
const initialState:UserInitialStateType = {
  users:[],
  status:"",
  error:""
}


type fetchUsersProps ={
  axiosPrivate:AxiosInstance
}
export const fetchUsers = createAsyncThunk('users/fetchUsers', async({axiosPrivate}:fetchUsersProps) =>{
  try{
    const response = await axiosPrivate.get('/users')
    return response.data
  }catch(err){
    throw new Error('Error fetching data')
  }
})


type DeleteUserProps ={
  initialUser:{
    _id:string
  },
  axiosPrivate:AxiosInstance
}
export const deleteUser = createAsyncThunk('users/deleteUser', async({initialUser, axiosPrivate}:DeleteUserProps) => {
  const {_id} = initialUser
  try{
    await axiosPrivate.delete(`users/${_id}`)
    return initialUser
  }catch(err){
    throw new Error("error when deleting user")
  }
})

const usersSlice = createSlice({
name:'users',
initialState,
reducers:{},
extraReducers:(builder) => {
  builder
  .addCase(fetchUsers.pending, (state) => {
    state.status = "loading";
  })
  .addCase(fetchUsers.fulfilled, (state, action) => {
    state.status = "succeeded";
    state.users = action.payload;
  })
  .addCase(fetchUsers.rejected, (state, action) => {
    state.status = "failed";
    state.error = action.error.message || 'something went wrong'
  })
  .addCase(deleteUser.fulfilled, (state, action) => {
    const {_id} = action.payload
    const users = state.users.filter(user => user._id !== _id)
    state.users = users
  })
},
});


export const selectAllUsers = (state:RootState) => state.users.users
export const selectUserById = (state:RootState, userId:string) => state.users.users.find(user => user._id === userId)
export const userStatus = (state:RootState) => state.users.status

export default usersSlice.reducer

