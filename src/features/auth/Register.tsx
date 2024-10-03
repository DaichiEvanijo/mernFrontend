import { useState } from "react"
import  axios from "../../api/axios";
import { AxiosError } from "axios";
import {Link}  from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerSchema, RegisterSchema } from "../../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import usePasswordHideShow from "../../hooks/usePasswordHideShow";



const Register = () => {
  const [success, setSuccess] = useState(false);

  const {register, handleSubmit, formState:{errors}, reset}= useForm<RegisterSchema>({
    resolver:zodResolver(registerSchema)
  })
  const [message, setMessage] = useState("")
  const {showPassword:showPassword1, handleMouseDown:handleMouseDown1, handleMouseLeave:handleMouseLeave1, handleMouseUp:handleMouseUp1} = usePasswordHideShow()
  const {showPassword:showPassword2, handleMouseDown:handleMouseDown2, handleMouseLeave:handleMouseLeave2, handleMouseUp:handleMouseUp2} = usePasswordHideShow()

  const onSubmit = async (data:RegisterSchema) => {
    try{
      const response = await axios.post('/register',
      JSON.stringify(data),
      {
        headers: {"Content-Type":"application/json"},
        withCredentials:true
      }
     )
     console.log(`${response.status}\t ${response.data.message}`)
     setSuccess(true)
     reset()
    }catch(err){
      if (err instanceof AxiosError) {
        setMessage(`${err.response?.status}\t ${err.response?.data.message}`);
      } else {
        setMessage('An unexpected error occurred');
      }
    }
  };


  return (
    <>
      {success ? (
        <section>
          <h1>Success !</h1>
          <Link to="/login"><button>Sign in</button></Link>
        </section>
      ):(

      <section className="cssforform">
        <h2>Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              autoComplete="off"
              {...register("user")}
              required
            />
            {errors.user &&<p>{errors.user.message}</p>}
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <div className='passwordinput'>
              <input
                type={showPassword1 ? "text":"password"}
                id="pwd"
                {...register("pwd")}
                required
              />
              <span onMouseDown={handleMouseDown1} onMouseUp={handleMouseUp1} onMouseLeave={handleMouseLeave1}> {showPassword1? "・":"👁️"}</span>
            </div>
            {errors.pwd && <p>{errors.pwd.message}</p>}
          </div>
          <div>
            <label htmlFor="confirm_pwd">Confirm Password:
            </label>
            <div className='passwordinput'>
              <input
                type={showPassword2 ? "text":"password"}
                id="confirm_pwd"
                {...register("matchPwd")}
                required
              />
              <span onMouseDown={handleMouseDown2} onMouseUp={handleMouseUp2} onMouseLeave={handleMouseLeave2}> {showPassword2 ? "・":"👁️"}</span>
            </div>
            {errors.matchPwd && <p>{errors.matchPwd.message}</p>}
          </div>
          <div className="flexforbutton">
            <button type="submit">Sign up</button>
          </div>
        </form>
        <div className="individualbutton">
          <p>Already registered ?</p>
          <Link to="/login"><button>Log in</button></Link>
        </div>
        <div className="individualbutton">
          <p>Discover posts without login ?</p>
          <Link to="/"><button>Home</button></Link>
        </div>
        <p>{message}</p>
      </section>
      )}
    </>
  )
}

export default Register