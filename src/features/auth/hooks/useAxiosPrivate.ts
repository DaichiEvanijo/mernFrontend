import { useEffect } from "react";
import { axiosPrivate } from "../../../api/axios";
import useRefreshToken from "./useRefreshToken";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../authSlice";


const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  const auth = useAppSelector(selectAuth)

  useEffect(() => {

    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']){
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
        }
        return config
      }, error => Promise.reject(error)
    )
  
    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async(error) => {
        const prevRequest = error?.config;
          // headerにaccess_tokenがない、もしくはaccess_tokenが無効
        if(error?.response?.status === 403 && !prevRequest?.sent){
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          console.log(`got new accessToken after AT expiration ${newAccessToken}`)
  
          return axiosPrivate(prevRequest)

        }
        return Promise.reject(error)
      }
      // if accesstoken expires, this async error will fire
      // 403→access is forbitten due to the expired accesstoken
      // !precvRequest?.sent→endless loup of tryign to get accesstoken and get 403 を防ぐため
    )
  
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  },[auth, refresh])

  return axiosPrivate
}

export default useAxiosPrivate


