import { Outlet } from "react-router"
import Header from "./Header"
import Footer from "./Footer"

const Layout = () => {
  return (
    <div className="App">
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Layout