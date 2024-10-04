import { useState, useEffect } from "react";

const getLocalValue =<T> (key:string, initialValue: T | (() => T) ) : T=> {
  // if this sheet is written for SSR(server side rendering) like Next.js
  if (typeof window === "undefined"){
    if(initialValue === "function") return (initialValue as () => T)()
  }

  const storedValue = localStorage.getItem(key)
  if (storedValue === null) {
    return typeof initialValue === "function" ? (initialValue as () => T)() : initialValue;
  }else{
    return JSON.parse(storedValue) 
  }
}

const useLocalStorage = <T>(key:string, initialValue: T | (() => T)) : [T, React.Dispatch<React.SetStateAction<T>>]=> {
  const [value, setValue] = useState(() => {
    return getLocalValue(key, initialValue)
  })
  // const [value, setValue] = useState(getLocalValue(key, initialValue))
  // と同じではない。これはレンダー時に毎回実行される

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  },[value,key])

  return [value,setValue]
}

export default useLocalStorage