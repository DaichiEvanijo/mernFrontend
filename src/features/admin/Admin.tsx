import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deleteUser, selectAllUsers } from "../users/usersSlice";

import useAxiosPrivate from "../auth/hooks/useAxiosPrivate";


const Admin = () => {
    const users = useAppSelector(selectAllUsers)

    const axiosPrivate = useAxiosPrivate()
    const dispatch = useAppDispatch()

    const usersList = users.map(user => {
        return (
            <li key={user._id} className="userlist">
                <p>{user.username}</p>
                <button onClick={() => dispatch(deleteUser({initialUser:{_id:user._id}, axiosPrivate}))} >Delete user</button>
            </li>
        )
    })

    return (
        <section>
            <h1>Admins Page</h1>
            <br />
            <ol >{usersList}</ol>
            <br />
            <div>
                <Link to="/"><button>Home</button></Link>
            </div>
        </section>
    )
}

export default Admin