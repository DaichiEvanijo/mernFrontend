import { Link, useNavigate } from "react-router-dom"

import { FaReact } from "react-icons/fa";
import { BiLogoTypescript } from "react-icons/bi";

import { useState } from "react";
import Hamburger from "hamburger-react";
import { useWindowSize } from "../hooks/useWindowSize";
import { useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";
import useLogout from "../features/auth/hooks/useLogout";


const Header = () => {
  const [isClicked, setIsClicked] = useState(false);
  const windowSize = useWindowSize()
  const auth = useAppSelector(selectAuth)

  const logout = useLogout()
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/linkpage");  
    } catch (err) {
      console.error("Logout failed: ", err);
    }
  };

  const createButton = () => {
    if (windowSize < 767) {
      setIsClicked((prev) => !prev);
    }
    if(!auth.username){
      alert("Please login in order to create your post")
    }
  } 
  const userButton = () => {
    if (windowSize < 767) {
      setIsClicked((prev) => !prev);
    }
    if(!auth.username){
      alert("Please login to see users and posts by user")
    }
  } 
  const adminButton = () => {
    if (windowSize < 767) {
      setIsClicked((prev) => !prev);
    }
    if(!auth.username){
      alert("Only admin can visit this page")
    }
  } 
  
  return (
    <header>
      <h1><Link to ="/"><FaReact className="icon" fontSize=" 40px" /><BiLogoTypescript fontSize=" 40px" className="icon" /></Link></h1>
      {windowSize < 767 && auth.username && <button onClick={handleLogout}>Logout</button> }
      <nav>
        <ul className={` ${isClicked ? 'navbarchange' : ''}`}>
          <li onClick={() => windowSize < 767 ? setIsClicked(prev => !prev):null}><Link to="/">Home</Link></li>
          <li onClick={createButton}><Link to={auth.username  ? "/post":"#"}>Create</Link></li>
          <li onClick={userButton}><Link to={auth.username ? "/user":"#"}>Users</Link></li>
          <li onClick={adminButton}><Link to={auth.username ? "/admin":"#"}>Admin</Link></li>
          {windowSize >= 767 && <li onClick={() => windowSize < 767 ? setIsClicked(prev => !prev):null}><Link to={auth.accessToken ? "#":"/login"}>{auth.username ? (<button onClick={handleLogout}>Logout</button>):(<button>Login</button>)}</Link></li>}
        </ul>
      </nav>
      <div className="hamburger-menu">
        <Hamburger toggled={isClicked} toggle={setIsClicked} size={24} />
      </div>
    </header>
    
  )
}

export default Header