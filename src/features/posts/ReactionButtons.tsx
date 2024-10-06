import {Post} from "./postsSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { addReaction } from './postsSlice';

import useAxiosPrivate from "../auth/hooks/useAxiosPrivate"
import { selectAuth } from "../auth/authSlice";

const reactionEmoji = {
  like:"🧡"
}

type ReacttionButtonsProps = {
  post : Post
}
const ReactionButtons = ({post}:ReacttionButtonsProps) => {
  const dispatch = useAppDispatch()

  const auth = useAppSelector(selectAuth)
  const axiosPrivate = useAxiosPrivate()
  const iconClick = () => {
   !auth.roles?.includes(2001) ? alert("Please login to interact with posts !! "):
   dispatch(addReaction({reactionData:{_id: post._id,},axiosPrivate}))
  }
  console.log(post.reactedUsers.length)

    return(
      <span className="reactionbuttonsection">
        <button type="button" onClick={iconClick} className="reactionbutton">{reactionEmoji.like}{post.reactions.like}</button>
        {post.reactedUsers.length === 1 ? 
        <small>{`${post.reactedUsers[0]} liked`}</small>:
        post.reactedUsers.length === 2 ?
        <small>{`${post.reactedUsers[0]} and ${post.reactedUsers[1]} liked`}</small>:
        post.reactedUsers.length > 2 ?
        <small>{`${post.reactedUsers[0]},${post.reactedUsers[1]} and others liked`}</small>:""}
      </span>
    )
}

export default ReactionButtons


// const obj = { a: 1, b: 2, c: 3 };
// console.log(Object.keys(obj)); 
// ["a", "b", "c"]
// console.log(Object.values(obj)); 
// [1, 2, 3]
// console.log(Object.entries(reactionEmoji))
// //   ["heart", "❤️‍🔥"],
