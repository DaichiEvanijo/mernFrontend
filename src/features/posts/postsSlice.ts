import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "../../api/axios";
import { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store"

import { AxiosInstance } from "axios";


export type Post = {
  _id: string,
  author: string,
  title: string,
  body: string,
  createdAt:string,
  // createdAtは最初のポスト作成日時の並びに保つため
  date:string,
  // dateはポストをupdateすると表示を変えるため
  reactions:{
    "like":number
  },
  reactedUsers:string[],
}
type PostsInitialStateType = {
  posts: Post[],
  status: string,
  error: string
}
const initialState: PostsInitialStateType = {
  posts: [],
  status: 'idle',
  error: ''
}


export const fetchPosts = createAsyncThunk('posts/fetschPosts', async () => {
  try {
    const response = await axios.get("/posts")
    return response.data
  } catch (error) {
    throw new Error("error when fetching data")
  }
})


type AddNewPostProps = {
  initialPost:{
    author:string,
    title:string,
    body:string,
  },
  axiosPrivate:AxiosInstance
}
export const addNewPost = createAsyncThunk('posts/addNewPost', async ({ initialPost, axiosPrivate }:AddNewPostProps) => {
  try{
    const response = await axiosPrivate.post('/posts', initialPost)
    return response.data
  }catch(err){
    throw new Error("error when posting data")
  }
})


type UpdatePostProps = {
  initialPost:{
      _id:string,
    title:string, 
    body:string,
  },
  axiosPrivate:AxiosInstance
}
export const updatePost = createAsyncThunk('posts/updatePost', async({initialPost,axiosPrivate}:UpdatePostProps) => {
  const {_id} = initialPost
  try{
    const response = await axiosPrivate.put(`/posts/${_id}`, initialPost)
    return response.data
  }catch(err){
    throw new Error("error when updating data")
  }
})


type DeletePostProps ={
  initialPost:{
    _id:string
  },
  axiosPrivate:AxiosInstance
}
export const deletePost = createAsyncThunk('posts/deletePost', async ({initialPost,axiosPrivate}:DeletePostProps) => {
  const {_id} = initialPost
  try{
    await axiosPrivate.delete(`/posts/${_id}`)
    return initialPost  
  }catch(err){
     throw new Error("error when deleting data'")
  }
})


type AddReactionProps ={
  reactionData:{
    _id:string, 
  },
  axiosPrivate:AxiosInstance
}
export const addReaction = createAsyncThunk('posts/addReaction', async ({reactionData,axiosPrivate}:AddReactionProps) => {
  try {
      const response = await axiosPrivate.post('/posts/reaction', reactionData);
      return response.data; // ← updated post from backend
  } catch (err) {
      throw new Error("Error when adding reaction");
  }
});




const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state,_action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
      state.status = 'succeeded'
      state.posts = state.posts.concat(action.payload)
      // return {
        //   ...state, posts:[...state.posts,...loadedPosts]
        // }
      })
      builder.addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'something went wrong'
      })
      builder.addCase(addNewPost.fulfilled, (state, action) => {
       state.posts.push(action.payload)
      // return {
      //   ...state, posts:[...state.posts, action.payload]
      // }
    })
    builder.addCase(updatePost.fulfilled, (state, action) =>{
      const {_id} = action.payload
      const unchangedPosts = state.posts.filter(post => post._id !== _id)
      state.posts = [...unchangedPosts, action.payload]
    })
      builder.addCase(deletePost.fulfilled, (state,action) =>{
      const {_id} = action.payload;
      const posts = state.posts.filter(post => post._id !== _id);
      state.posts = posts;
    })
    builder.addCase(addReaction.fulfilled, (state, action) => {
      const updatedPost = action.payload;
      const existingPost = state.posts.find(post => post._id === updatedPost._id);
      if (existingPost) {
          existingPost.reactions = updatedPost.reactions;
          existingPost.reactedUsers = updatedPost.reactedUsers
      }
  })
  }
})

export const selectAllPosts = (state:RootState) => state.posts.posts
export const getPostsStatus = (state:RootState) => state.posts.status
export const getPostsError = (state:RootState) => state.posts.error
export const selectPostById = (state:RootState,postId:string) => state.posts.posts.find(post => post._id === postId)
// export const selectPostByAuthor = (state:RootState,author:string) => state.posts.posts.filter(post => post.author === author)
// Modify selectPostByAuthor using createSelector to memoize the result
export const selectPostByAuthor = createSelector([
  (state: RootState) => state.posts.posts,
  (_: RootState, author: string) => author,],
  (posts, author) => posts.filter(post => post.author === author)
);

export default postsSlice.reducer

