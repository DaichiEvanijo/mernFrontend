import { useAppSelector } from "../../app/hooks"
import { selectAllPosts, getPostsStatus, getPostsError } from "./postsSlice"
import PostsExcerpt from "./PostsExcerpt"
import Pagination from "./Pagination"
import { useCallback, useEffect, useMemo, useState } from "react"
import { selectAuth } from "../auth/authSlice"
import { Link } from "react-router-dom"


const PostsList = () => {
  const posts = useAppSelector(selectAllPosts)
  const postStatus = useAppSelector(getPostsStatus)
  const postError = useAppSelector(getPostsError)

  const auth = useAppSelector(selectAuth)

  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10
  const lastPostsIndex = currentPage*postsPerPage
  const firstPostsIndex = lastPostsIndex-postsPerPage
  const [filteredPosts, setFilteredPosts] = useState(posts)
  const [searchText, setSearchText] = useState("")
  // 1.filtering posts and include the filtered posts in filteredPosts
  const performFiltering = useCallback(() => {
    const searchFilteredPosts = posts.filter(post => 
      post.title.toLowerCase().includes(searchText.toLowerCase().trim()) ||post.author.toLowerCase().includes(searchText.toLowerCase().trim())
    )
    setFilteredPosts(searchFilteredPosts)
    setCurrentPage(1)
  },[posts,searchText])
  // 2. rearranging filteredPosts chronologically
  const orderedPosts = useMemo(() => filteredPosts.slice()
  .sort((a, b) => {
    if (b.createdAt && a.createdAt){
      return b.createdAt.localeCompare(a.createdAt);
    }else{
      return 0
    }
  }),[filteredPosts])
  // 3. slicing chronologically arranged filteredPosts into each pagination
  const currentPosts = useMemo(() => orderedPosts.slice(firstPostsIndex, lastPostsIndex),[orderedPosts, firstPostsIndex, lastPostsIndex])

  
  useEffect(() => {
    if(searchText.trim()){
      performFiltering()
    }else{
      setFilteredPosts(posts)
    }
  }, [posts, searchText])



  let content;
  if (postStatus === 'loading') {
    
    content = <p>is loading....</p>
    
  } else if (postStatus === 'succeeded') {
    
    const postsContent = currentPosts.map(post => <PostsExcerpt key={post._id} post={post}/>)
    content = postsContent.length ? postsContent:<p style={{textAlign:"center"}}>There is no post to display based on your searching words</p>
    
  }else if(postStatus==='failed'){

    content = <p>{postError}</p>
  }

  return (
    <section className="home">
      <section className="postslist" >
        <h1>Japanese Prefecture Posts</h1>
        {!auth.username && 
          <div className="minihero">
            <p>Login for creating, editing your posts!</p>
            <p>or Enjoy reading posts without login!</p>
            <Link to="/login"><button>Login</button></Link>
          </div>
        }
        <div className="filtersection">
         <input type="text" placeholder="input a prefecture/author" value={searchText} onChange={e => setSearchText(e.target.value)} onKeyDown={e => {if(e.key === "Enter") performFiltering()}} />
         <button onClick={() => setFilteredPosts(posts)}>Reset filter</button>
        </div>
        {content}
      </section>
      <section className="pagination">
        <Pagination  filteredPostsLength ={filteredPosts.length} postsPerPage={postsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      </section>
    </section>
    
  )
}

export default PostsList