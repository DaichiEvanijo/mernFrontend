import { useState } from "react"
import { useForm } from "react-hook-form"
import axios from "../../api/axios"
import { AxiosError } from "axios"
import { Link } from "react-router-dom"

type FormDataType ={
  "username":string
  "email":string
}
const ForgetPassword = () => {
  const {register, handleSubmit, formState:{errors}, reset} = useForm<FormDataType>()
  const [message, setMessage] = useState("")
  const onSubmit =async (data:FormDataType) => {
    try{
      const response = await axios.post("/auth/forgetpassword", data)
      reset()
      setMessage(response.data.message)
    }catch(err){
      if(err instanceof AxiosError){
        setMessage(`${err.response?.status}\t${err.response?.data.message}`)
      } else {
        setMessage("An unexpected error outside axios error occurred")
      }
    }
  }

  return (
    <section className="cssforform">
      <h2>Forget Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" {...register("username", {required:"Username is required"})} />
          {errors.username && <p>{errors.username.message}</p>}
        </div>
        <div>
          <label htmlFor="email">Your email address for sending a link to reset PW:</label>
          <input type="email" id="email" {...register("email", {required:"Email is required"})} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div className="flexforbutton">
          <button type="submit">Send password reset link</button>
          <Link to="/login"><button>back to login</button></Link>
        </div>
      </form>
      <p>{message}</p>
    </section>

  )
}

export default ForgetPassword