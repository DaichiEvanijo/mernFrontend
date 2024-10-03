import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "./usersSlice";
import { Link } from "react-router-dom";

const UsersList = () => {

  const users = useAppSelector(selectAllUsers)

  const renderedUsers = users.map(user => {
    return(
      <li key={user._id}>
        <Link to={`/user/${user._id}`}>{user.username}</Link>
      </li>
    )
  })

  return (
    <section className="userslist">
      <h2>Users List</h2>
      <ol>{renderedUsers}</ol>
    </section>
  )
}

export default UsersList