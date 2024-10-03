import {useLocation, Navigate, Outlet} from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { selectAuth } from "./authSlice"

type RequireAuthProps ={
  allowedRoles:number[]
}
const RequireAuth = ({allowedRoles}:RequireAuthProps) => {
  const auth = useAppSelector(selectAuth)
  const location = useLocation()

  return (
    auth?.roles?.find(role => allowedRoles?.includes(role))
    ?<Outlet/> : auth?.username
    ? <Navigate to="/unauthorized" state={{from:location}} replace/>
    :<Navigate to="/login" state={{from:location}} replace/>
  )
}

export default RequireAuth