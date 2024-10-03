import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { addNewPost } from "./postsSlice"
import { useNavigate } from "react-router"

import useAxiosPrivate from "../auth/hooks/useAxiosPrivate"
import { selectAuth } from "../auth/authSlice"

import { useForm } from "react-hook-form"
import { postSchema, PostSchema } from "../../lib/types"
import { zodResolver } from "@hookform/resolvers/zod"


const AddPostForm = () => {
  const dispatch = useAppDispatch()
  const [addRequestStatus, setAddRequestStatus] = useState("idle")
  const navigate = useNavigate()
  
  const axiosPrivate = useAxiosPrivate()
  const auth = useAppSelector(selectAuth)

  const {register, handleSubmit, formState:{errors, isSubmitting}, reset} = useForm<PostSchema>({resolver:zodResolver(postSchema)})

  const onSubmit = async (data:PostSchema) => {
    if(addRequestStatus ==="idle"){
      try{
        setAddRequestStatus("pending");
        dispatch(addNewPost({initialPost:{...data, author:auth.username ?? ""},axiosPrivate})).unwrap();
        reset()
        navigate('/')
      }catch(err){
        console.log("Create could not complete");
      }finally{
        setAddRequestStatus("idle")
      }
    }
  }
    

  return (
    <section className="cssforformwithheaderfooter">
      <h2>Add new Post</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="postAuthor">Author:</label>
          <input type="text" id="postAuthor" value={auth.username ?? ""} readOnly/>
        </div>
        <div>
          <label htmlFor="postTitle">Title:</label>
          <input type="text" id="postTitle" {...register("title")} />
          {errors.title && <p>{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="postBody">Content:</label>
          <textarea id="postBody" className="large-textarea" {...register("body")} />
          {errors.body && <p>{errors.body.message}</p>}
        </div>
        <div className="flexforbutton">
          <button type="submit"  disabled={isSubmitting} className={`${isSubmitting ? "disabled" : ""}`}>Save Post</button>
        </div>
      </form>
    </section>
  )
}

export default AddPostForm


// https://chatgpt.com/c/66f9a551-c8c0-8007-a23f-f79ee79c2e86