import { Post } from "./postsSlice"
import { useState } from "react"

type PaginationProps = {
  posts:Post[]
  postsPerPage:number,
  currentPage:number,
  setCurrentPage:React.Dispatch<React.SetStateAction<number>>
}
const Pagination = ({posts, postsPerPage, currentPage, setCurrentPage}:PaginationProps) => {

  const [numDisplayLimit] =useState(5)
  const [maxNumDisplay, setMaxNumDisplay] =useState(5)
  const [minNumDisplay, setMinNumDisplay] =useState(1)

  const totalPages = Math.ceil(posts.length / postsPerPage)

  const handleNextBtn = () => {
    if(currentPage < totalPages) {
      if(currentPage + 1 > maxNumDisplay){
        setMaxNumDisplay(prev => prev + numDisplayLimit)
        setMinNumDisplay(prev => prev + numDisplayLimit)
      }
      setCurrentPage(prev => prev + 1)
    }
  }
  const handlePrevBtn =() => {
    if((currentPage-1) % numDisplayLimit == 0){
      setMaxNumDisplay(prev => prev - numDisplayLimit)
      setMinNumDisplay(prev => prev - numDisplayLimit)
    }
    setCurrentPage(prev => prev - 1)
  }
  
  
  let pages :number[]=[]
  for(let i = 1; i<= Math.ceil(posts.length/postsPerPage);i++){
    pages.push(i)
  }


  const dotOnDecrementSide = 1 < minNumDisplay ? <span>&hellip;</span> : null;
  const dotOnIncrementSide = pages.length > maxNumDisplay ? <span>&hellip;</span> :null
  
  
  return (
    <div className="paginationbuttonlist">
      <div className="prevbtn">
        <button onClick={handlePrevBtn} disabled={currentPage === 1} className={currentPage === 1 ? "disabled" : ""}>Prev</button>
      </div>
      <div className="paginationnumber">
        {dotOnDecrementSide}
        {pages.map((page, index) => {
          if(page >= minNumDisplay && page <= maxNumDisplay){
            return(
              <button key={index} onClick={()=>setCurrentPage(page)} className={currentPage === page ? "disabled" : ""}>{page}</button>
            )
          }else{
            return null
          }
        })}
        {dotOnIncrementSide}
      </div>
      <div className="nextbtn">
        <button onClick={handleNextBtn} disabled={currentPage >= totalPages} className={ currentPage >= totalPages ? "disabled" : ""}>Next</button>
      </div>
    </div>
  )
}

export default Pagination