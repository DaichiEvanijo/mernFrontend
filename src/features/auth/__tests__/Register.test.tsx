import { render, screen} from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Register from "../Register"
import axios from "../../../api/axios"
import user from "@testing-library/user-event"


const renderComponent = () => {
  render(
    <BrowserRouter>
      <Register/>
    </BrowserRouter>
  )
}


describe("Register - behavior", () => {

  it("form submittion with axios.post in case of successful API response ", async () => {
    renderComponent()

    jest.spyOn(axios, "post").mockResolvedValueOnce({ data: { message: "Registration was successful"}})

    const usernameInput = screen.getByRole("textbox",{name:/username/i})
    await user.click(usernameInput)
    await user.keyboard("Sawamura")
    
    const passwordInput = screen.getByLabelText(/^Password:$/);
    await user.click(passwordInput)
    await user.keyboard("Ii$12345")

    const confirmPasswordInput = screen.getByLabelText(/^Confirm Password:$/);
    await user.click(confirmPasswordInput)
    await user.keyboard("Ii$12345")

    const submitButton = screen.getByRole("button", {name:/Sign up/i})
    await user.click(submitButton)

    expect(axios.post).toHaveBeenCalled()
    expect(axios.post).toHaveBeenCalledWith("/register", JSON.stringify({
      user: "Sawamura",
      pwd: "Ii$12345",
      matchPwd: "Ii$12345",
    }),
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
    )

    const h1AfterSuccessRegister = screen.getByRole("heading", {name:/Success !/i})
    expect(h1AfterSuccessRegister).toBeInTheDocument()
  })

    

  it("form submittion with axios.post in case of unsuccessful API response ", async() => {
    renderComponent()

    jest.spyOn(axios, "post").mockRejectedValueOnce({})

    const usernameInput = screen.getByRole("textbox",{name:/username/i})
    await user.click(usernameInput)
    await user.keyboard("Daichi")
    
    const passwordInput = screen.getByLabelText(/^Password:$/);
    await user.click(passwordInput)
    await user.keyboard("Aa$12345")

    const confirmPasswordInput = screen.getByLabelText(/^Confirm Password:$/);
    await user.click(confirmPasswordInput)
    await user.keyboard("Aa$12345")

    const submitButton = screen.getByRole("button", {name:/Sign up/i})
    await user.click(submitButton)

    expect(axios.post).toHaveBeenCalled()
    expect(axios.post).toHaveBeenCalledWith("/register", JSON.stringify({
      user: "Daichi",
      pwd: "Aa$12345",
      matchPwd: "Aa$12345",
    }),
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
    )

    expect(screen.getByText("An unexpected error occurred")).toBeInTheDocument()
  })
})

