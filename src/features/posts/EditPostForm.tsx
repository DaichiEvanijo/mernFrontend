import { useParams } from "react-router"
import { useAppSelector } from "../../app/hooks";
import { deletePost, selectPostById } from "./postsSlice";
import { useState } from "react";
import { updatePost } from "./postsSlice";
import { useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router";

import useAxiosPrivate from "../auth/hooks/useAxiosPrivate";

import { useForm } from "react-hook-form";
import { postEditSchema, PostEditSchema } from "../../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";


type RouterParams ={
  postId:string;
}
const EditPostForm = () => {
  const {postId} = useParams<RouterParams>()
  const post = postId ? useAppSelector((state)=> selectPostById(state, postId)):null
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {register, handleSubmit, formState:{errors,isSubmitting }} = useForm<PostEditSchema>({resolver:zodResolver(postEditSchema),
    defaultValues:{
      title:post?.title ,
      body:post?.body 
    }
  })
  const [addRequestStatus, setAddRequestStatus] = useState("idle")

  const axiosPrivate = useAxiosPrivate()

  const onSavePostClicked = (data:PostEditSchema) => {
    if(addRequestStatus === "idle" && post){
      try {
        setAddRequestStatus("pending");
        dispatch(updatePost({initialPost:{ ...data, _id:post._id },axiosPrivate})).unwrap();
        navigate(`/post/${post._id}`)
      } catch (err) {
        console.log("Update could not complete");
      } finally {
        setAddRequestStatus("idle");
      }
    } 
  }

  const onDeletePostClicked =() => {
    if(post){
      try{
        setAddRequestStatus("pending")
        dispatch(deletePost({initialPost:{_id:post._id},axiosPrivate})).unwrap()
        navigate('/')
      } catch (err) {
        console.log("Delete could not complete");
      } finally {
        setAddRequestStatus("idle");
      }
    }
  }

  if(!post) {
    return (
      <section>
        <h2>page not found !!</h2>
      </section>
    )
  }
  
  return (
    <section className="cssforformwithheaderfooter">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit(onSavePostClicked)}>
        <div>
          <label htmlFor="postAuthor">Author:</label>
          <input type="text" id="postAuthor" value={post.author} readOnly />
        </div>
        
        <div>
          <label htmlFor="postTitle">Title:</label>
          <input type="text" id="postTitle" {...register("title")} />
          {errors.title && <p>{errors.title.message}</p>}
        </div>


        <div>
          <label htmlFor="postBody">Content:</label>
          <textarea id="postBody"className="large-textarea" {...register("body")} />
          {errors.body && <p>{errors.body.message}</p>}
        </div>

        <div className="flexforbutton">
          <button type="submit" disabled={isSubmitting}
          className={`${isSubmitting? "disabled":""}`}>Save Post</button>
          <button type="button" onClick={onDeletePostClicked}>Delete Post</button>
        </div>
      </form>
    </section>
  )
}

export default EditPostForm