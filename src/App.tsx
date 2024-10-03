import {Routes, Route} from "react-router-dom"
import Layout from "./layout/Layout"
import PostsList from "./features/posts/PostsList"
import AddPostForm from "./features/posts/AddPostForm"
import SinglePostPage from "./features/posts/SinglePostPage"
import EditPostForm from "./features/posts/EditPostForm"
import UsersList from "./features/users/UsersList"
import UserPage from "./features/users/UserPage"
import Admin from "./features/admin/Admin"
import { Navigate } from "react-router-dom"

import Login from "./features/auth/Login"
import Register from "./features/auth/Register"
import Unauthorized from "./features/auth/Unauthorized"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"

import { useEffect } from "react"
import { fetchUsers } from "./features/users/usersSlice"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import {  selectAuth} from "./features/auth/authSlice"
import useAxiosPrivate from "./features/auth/hooks/useAxiosPrivate"
import ResetPassword from "./features/auth/ResetPassword"
import ForgetPassword from "./features/auth/Forgetpassword"


function App() {
  const auth = useAppSelector(selectAuth)
  const axiosPrivate = useAxiosPrivate()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (auth.roles.includes(2001)) {
      dispatch(fetchUsers({ axiosPrivate }));
    }
  }, [auth]);

  
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgetpassword" element={<ForgetPassword />} />
      <Route path="resetpassword/:token" element={<ResetPassword />} />
      <Route path="unauthorized" element={<Unauthorized/>} />

      <Route path="/" element={<Layout/>}>

        <Route element={<PersistLogin/>}>

          <Route index element={<PostsList/>}/> 
          <Route path="post/:postId" element={<SinglePostPage/>}/>   

          <Route element={<RequireAuth allowedRoles={[2001]}/>} >
            <Route path="post">
              <Route index element={<AddPostForm/>}/>
              <Route path="edit/:postId" element={<EditPostForm/>}/>
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={[2001]}/>} >
            <Route path="user">
              <Route index element={<UsersList/>}/>
              <Route path=":userId" element={<UserPage/>}/>
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={[5150]} />}>
            <Route path="admin">
              <Route index element={<Admin />} />
            </Route>
          </Route>
          
        </Route>
        <Route path="*" element={<Navigate to="/" replace/>}/>
        
      </Route>
    </Routes>
  )
}

export default App
