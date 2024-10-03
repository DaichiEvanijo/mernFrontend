import { useState, useEffect } from "react";

const getLocalValue =<T> (key:string, initialValue: T | (() => T) ) : T=> {
  // if this sheet is written for SSR(server side rendering) like Next.js
  if (typeof window === "undefined") return initialValue instanceof Function ? initialValue() : (initialValue as T);
  // if a value is already stored in localStorage
  if(localStorage.getItem(key)) return JSON.parse(localStorage.getItem(key)!)
  // if a initialValue is a function
  if(initialValue instanceof Function) return initialValue()
  // for other cases
  return initialValue
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