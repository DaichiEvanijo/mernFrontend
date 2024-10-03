import { useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router"
import axios from "../../api/axios"
import { AxiosError } from "axios"
import { Link } from "react-router-dom"
import usePasswordHideShow from "../../hooks/usePasswordHideShow"


type FormDataType ={
  "password":string
}

type RouterParams ={
  token:string
}
const ResetPassword = () => {
  const {token} = useParams<RouterParams>()
  console.log(token)
  const {register, handleSubmit, formState:{errors},reset} = useForm<FormDataType>()
  const [message, setMessage] = useState("")
  const [showLoginButton, setShowLoginButton] = useState(false)
  const {showPassword, handleMouseDown, handleMouseLeave,handleMouseUp} = usePasswordHideShow()

  const onSubmit= async (data:FormDataType) => {
    try{
      const response =await axios.post(`/auth/resetpassword/${token}`, data)
      reset()
      setMessage(`${response.status} \t ${response.data.message}`)
      setShowLoginButton(true)
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
      <h2>Reset password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="password">New Password:</label>
          <div className='passwordinput'>
              <input
                type={showPassword ? "text":"password"}
                id="confirm_pwd"
                {...register("password")}
                required
              />
              <span onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}> {showPassword ? "・":"👁️"}</span>
          </div>
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div className="flexforbutton">
          <button type="submit">Reset Password</button>
        </div>
      </form>
      <p>{message}</p>
      {showLoginButton && <Link to="/login"><button>Login again</button></Link>}
    </section>
  )
}

export default ResetPassword
