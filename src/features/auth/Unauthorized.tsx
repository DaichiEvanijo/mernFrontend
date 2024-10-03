import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <section className="unauthorizedpage">
      <h1>Unauthorized</h1>
      <br />
      <p>You do not have access to the requested page as you are not admin of this website.</p>
      <div className="flexGrow">
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </section>
  )
}

export default Unauthorized