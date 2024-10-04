import axios from "axios"

// instance
export default axios.create({
  baseURL:"https://mern-api-hokt.onrender.com"
})
// baseURL:"http://localhost:3500"

// instance 
export const axiosPrivate = axios.create({
  baseURL:"https://mern-api-hokt.onrender.com",
  headers:{"Content-Type":"application/json"},
  withCredentials:true
})
// baseURL:"http://localhost:3500",

