import { render , screen} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ResetPassword from "../ResetPassword";
import axios from "../../../api/axios";
import user from "@testing-library/user-event";


jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: jest.fn().mockReturnValue({token:"greatToken"}),
}));

const renderComponent = () => {

  render(
    <BrowserRouter>
      <ResetPassword/>
    </BrowserRouter>
  )
}


describe("ResetPassword - behavior", () => {
  
  it("form submittion with axios.post in case of successful API response and show login button", async() => {
    renderComponent()

    jest.spyOn(axios, "post").mockResolvedValueOnce({status:200, data:{message:"Password has been reset"}})

    const passwordInput = screen.getByLabelText(/new password:/i)
    await user.click(passwordInput)
    await user.keyboard("Aa$12345")

    const submitButton = screen.getByRole("button", {name:/Reset Password/i})
    await user.click(submitButton);

    expect(axios.post).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith("/auth/resetpassword/greatToken", {
      password: "Aa$12345",
    });
    expect(screen.getByText(/Password has been reset/)).toBeInTheDocument();

    const LoginLink = screen.getByRole("link", {name:/Login again/i})
    expect(LoginLink).toBeInTheDocument()
  })

  it("form submittion with axios.post in case of unsuccessful API response and does not show login button",async () => {
    renderComponent()

    jest.spyOn(axios, "post").mockRejectedValueOnce({})

    const passwordInput = screen.getByLabelText(/new password:/i)
    await user.click(passwordInput)
    await user.keyboard("Aa$12345")

    const submitButton = screen.getByRole("button", {name:/Reset Password/i})
    await user.click(submitButton);

    expect(axios.post).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith("/auth/resetpassword/greatToken", {
      password: "Aa$12345",
    });
    expect(screen.getByText(/An unexpected error outside axios error occurred/)).toBeInTheDocument();

    const LoginLink = screen.queryByRole("link", {name:/Login again/i})
    expect(LoginLink).not.toBeInTheDocument()
  })
})

