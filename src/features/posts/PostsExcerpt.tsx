import TimeAgo from "./TimeAgo"
import ReactionButtons from "./ReactionButtons"
import { Link } from "react-router-dom"
import React, {FC} from "react"
import {Post} from "./postsSlice"

import { useAppSelector } from "../../app/hooks"
import { selectAuth } from "../auth/authSlice"


type PostsExcerptProps = {
  post : Post
}
let PostsExcerpt: FC<PostsExcerptProps> = ({post}:PostsExcerptProps) => {
  const auth = useAppSelector(selectAuth)

  return (
    <li className="individualpost">
      <h3>{post.title}</h3>
      <p>{`${(post.body).slice(0,50)}...`}</p>
      <div className="linkauthordate">
        <Link to={`/post/${post._id}`}><button>View Post</button></Link>
        {post.author === auth.username &&<Link to={`/post/edit/${post._id}`}><button>Edit Post</button></Link>}
        <span>{`by ${post.author}`}</span>
        <TimeAgo timestamp={post.date}/>
      </div>
      <ReactionButtons post={post}/>
    </li>
  )
}


PostsExcerpt = React.memo(PostsExcerpt)
// postsのstateに変更がない99個の個々postに関してはレンダリングされないようにする

export default PostsExcerpt