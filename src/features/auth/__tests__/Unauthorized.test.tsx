import { render, screen} from "@testing-library/react"
import Unauthorized from "../Unauthorized"
import user from "@testing-library/user-event"


const mockedNavigate = jest.fn()
jest.mock("react-router-dom", ()=> ({
  ...jest.requireActual("react-router-dom"),
  useNavigate:() => mockedNavigate
}))

const renderComponent = () => {
  render(
    <Unauthorized/>
  )
}

describe("Unauthorized - behavior", ()=> {
  it("Go back button should lead us to go back to the previous page", async () => {
    renderComponent()

    const gobackButton = screen.getByRole("button", {name: /go back/i})
    await user.click(gobackButton)

    expect(mockedNavigate).toHaveBeenCalledWith(-1)
  })
})