import axios from "axios"

// instance
export default axios.create({
  baseURL:"https://mernapi.onrender.com"
})

// instance 
export const axiosPrivate = axios.create({
  baseURL:"https://mernapi.onrender.com",
  headers:{"Content-Type":"application/json"},
  withCredentials:true
})


