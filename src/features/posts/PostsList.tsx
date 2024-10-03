import { useAppSelector } from "../../app/hooks"
import { selectAllPosts, getPostsStatus, getPostsError } from "./postsSlice"
import PostsExcerpt from "./PostsExcerpt"
import Pagination from "./Pagination"
import { useState } from "react"



const PostsList = () => {
  const posts = useAppSelector(selectAllPosts)
  const postStatus = useAppSelector(getPostsStatus)
  const postError = useAppSelector(getPostsError)

  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10
  const lastPostsIndex = currentPage*postsPerPage
  const firstPostsIndex = lastPostsIndex-postsPerPage


  const orderedPosts = posts.slice()
  .sort((a, b) => {
    if (b.createdAt && a.createdAt){
      return b.createdAt.localeCompare(a.createdAt);
    }else{
      return 0
    }
  });
  const currentPosts = orderedPosts.slice(firstPostsIndex, lastPostsIndex)
  
  
  let content;
  if (postStatus === 'loading') {
    
    content = <p>is loading....</p>
    
  } else if (postStatus === 'succeeded') {
    
    content = currentPosts.map(post => <PostsExcerpt key={post._id} post={post}/>)
    
  }else if(postStatus==='failed'){

    content = <p>{postError}</p>
  }

  return (
    <section className="home">
      <section className="postslist" >
        <h2>Posts</h2>
        {content}
      </section>
      <section className="pagination">
        <Pagination  posts ={posts} postsPerPage={postsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      </section>
    </section>
    
  )
}

export default PostsList