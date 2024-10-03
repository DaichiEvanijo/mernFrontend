import axios from "../../../api/axios"
import { useAppDispatch } from "../../../app/hooks"
import { setAuth } from "../authSlice"

const useRefreshToken = () => {
  const dispatch = useAppDispatch()

  const refresh = async() => {
    const response = await axios.get("/refresh",{
      withCredentials:true
    })
    console.log(`second accessToken ${response.data.accessToken}`)
    dispatch(setAuth({ username: response.data.username, roles: response.data.roles, accessToken:response.data.accessToken}))

    return response.data.accessToken
  }

  return refresh
}

export default useRefreshToken