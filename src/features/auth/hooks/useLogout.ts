import axios from "../../../api/axios";
import { useAppDispatch } from "../../../app/hooks";
import { clearAuth } from "../authSlice";

const useLogout = () => {
  const dispatch = useAppDispatch()
  const logout = async ()=> {
    dispatch(clearAuth())
    try{
     await axios("/logout",{
        withCredentials:true
      })
    }catch(err){
      console.log(err)
    }
  }
  return logout
}
export default useLogout
