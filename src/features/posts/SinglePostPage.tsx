import { useParams } from "react-router"
import { useAppSelector } from "../../app/hooks"
import { selectPostById } from "./postsSlice"
import { Link } from "react-router-dom"
import TimeAgo from "./TimeAgo"
import ReactionButtons from "./ReactionButtons"

import { selectAuth } from "../auth/authSlice"


type RouterParams ={
  postId:string;
}
const SinglePostPage = () => {
  const {postId} = useParams<RouterParams>()
  const post = postId ? useAppSelector((state) => selectPostById(state, postId)): null;

  const auth = useAppSelector(selectAuth)

  if(!post) {
    return (
      <section>
        <h2>page not found !!</h2>
      </section>
    )
  }
  
  return (
    <article className="singlepostpage">
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <div className="linkauthordate">
      {post.author === auth.username && <Link to={`/post/edit/${post._id}`}><button>Edit Post</button></Link>}
        <Link to="/"><button>Back to postlist</button></Link>
        <span>{`by ${post.author}`}</span>
        <TimeAgo timestamp={post.date}/>
      </div>
      <ReactionButtons post={post}/>
    </article>
  )
}


export default SinglePostPage


// UserPageとの比較
// Login後、SinglePostPageに行きをリフレッシュすると、Appコンポシートが読まれ(即ちstore.dispatch({fetchPosts()})が読まれ、PersistLoginでverifyRefreshToken()が発動され、await refresh()が始まる前にすでにpostを取得できるので、このシートではstatus === "loading"などのコードは不要で問題なく働く