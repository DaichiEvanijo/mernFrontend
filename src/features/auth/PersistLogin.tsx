import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "./hooks/useRefreshToken";

import useLocalStorage from "../../hooks/useLocalStorage"; 
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "./authSlice";

const PersistLogin = () =>{
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()

  const auth = useAppSelector(selectAuth)
  const[persist] = useLocalStorage("persist", false)

  useEffect(() => {
    let isMounted = true
    const verifyRefreshToken = async () => {
      try{
        await refresh()
      }catch(err){
        console.error(err)
      }finally{
        isMounted && setIsLoading(false)
      }
    }
    if (persist) {
      !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    } else {
      setIsLoading(false);
    }

    return () =>{
      isMounted = false}
  },[])
  // testing purpose
  useEffect(() => {
    console.log(`isLoading:${isLoading}`)
    console.log(`aT:${JSON.stringify(auth?.accessToken)}`)
  },[isLoading])

  return (
    <>
      {!persist ? <Outlet/>:
        isLoading ? <p style={{maxWidth:"1024px", margin: "0 auto",
          padding: "0 1.25rem"}}>is Loading...</p> : <Outlet/>
      }
    </>
  )
}

export default PersistLogin