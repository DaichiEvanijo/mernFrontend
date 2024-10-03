import axios from '../../api/axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useToggle from "./hooks/useToggle"
import { AxiosError } from "axios"

import { useAppDispatch } from "../../app/hooks"
import {setAuth} from "./authSlice"

import { useForm } from 'react-hook-form'
import { loginSchema, LoginSchema } from '../../lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import usePasswordHideShow from '../../hooks/usePasswordHideShow'

const Login = () => {

  const [check, setCheck] = useToggle("persist",false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/";
  const dispatch = useAppDispatch()

  const {register, handleSubmit, reset, formState:{errors}} = useForm<LoginSchema>({
    resolver:zodResolver(loginSchema)
  })
  const [message, setMessage] = useState("")
  const {showPassword,handleMouseDown,
    handleMouseUp,
    handleMouseLeave,} = usePasswordHideShow()

  const onSubmit = async (data:LoginSchema) => {
    try {
      const response = await axios.post('/auth',
        JSON.stringify(data),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      console.log(JSON.stringify(response?.data))
      // →このコードでconsole上に{"roles":"",accessToken:""}というオブジェクトがバックエンドから来ていることがわかる
      const accessToken = response?.data?.accessToken
      console.log(`login accessToken ${accessToken}`)
      const roles = response?.data?.roles
      dispatch(setAuth({ username:data.user, accessToken, roles })); 
      reset()
      // login画面に映る前にuserが行きたかった画面(from)にnavigateするように設定
      navigate(from, {replace:true})
    } catch (err) {
      if(err instanceof AxiosError){
        if (!err?.response) {
          setMessage("no server response")
        } else if (err.response?.status === 400) {
          setMessage(err.response.data.message)
        } else if (err.response?.status === 401) {
          setMessage(err.response.data.message)
        }else{
          setMessage("Registration failed")
        }
      } else {
        setMessage("An unexpected error outside axios error occurred")
      }
    }
  }

  return (
    <section className="cssforform">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            {...register("user")}
            autoComplete="off"
            required
          />
          {errors.user &&<p>{errors.user.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <div className='passwordinput'>
            <input
              type={showPassword ? "text":"password"}
              id="password"
              {...register("pwd")}
              required
            />
            <span onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}> {showPassword ? "・":"👁️"}</span>
          </div>
          {errors.pwd && <p>{errors.pwd.message}</p>}
        </div>
        <div className="flexforbutton">
          <input type="checkbox" id="persist" onChange={() => setCheck(prev => !prev)} checked={check} />
          <label htmlFor="persist">Trust this device</label>
          <button type="submit">Sign in</button>
        </div>
        <p>{message}</p>
      </form>
      <div className='individualbutton'>
        <p>Create an account ?</p>
        <Link to="/register"><button>Register</button></Link>
      </div>
      <div className='individualbutton'>
        <p>Discover posts without login ? </p>
        <Link to="/"><button>Home</button></Link>
      </div>
      <div  className='individualbutton'>
        <p>Forgot your password ?</p>
        <Link to="/forgetpassword"><button>Reset Password</button></Link>
      </div>
    </section>
  )
}

export default Login