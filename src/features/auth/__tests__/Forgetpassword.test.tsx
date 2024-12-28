// import { createServer } from "../../../../test/server";
import axios from "../../../api/axios";
import { render, screen } from "@testing-library/react";
import ForgetPassword from "../Forgetpassword";
import user from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

const renderComponent = () => {
  render(
    <BrowserRouter>
      <ForgetPassword />
    </BrowserRouter>
  );
};



describe("Forgetpassword - behavior", () => {

  it("form submittion with axios.post in case of successful API response", async () => {
    // createServer([
    //   {
    //     path: "/auth/forgetpassword",
    //     method: "post",
    //     res: () => {
    //       return {message:"success"};
    //     },
    //   },
    // ]);
    renderComponent();

    jest.spyOn(axios, "post").mockResolvedValueOnce({ data: { message: "Reset link sent" } });

    const usernameInput = screen.getByRole("textbox", { name: /username/i });
    await user.click(usernameInput);
    await user.keyboard("Daichi");

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    await user.click(emailInput);
    await user.keyboard("takanogi2468@gmail.com");

    const submitButton = screen.getByRole("button", {
      name: /send password reset link/i,
    });
    await user.click(submitButton);

    expect(axios.post).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith("/auth/forgetpassword", {
      username: "Daichi",
      email: "takanogi2468@gmail.com",
    });

    expect(screen.getByText("Reset link sent")).toBeInTheDocument();
  });


  it("form submittion with axios.post in case of unsuccessful API response without instance of Axios", async () => {
    renderComponent();

    jest.spyOn(axios, "post").mockRejectedValueOnce({});

    const usernameInput = screen.getByRole("textbox", { name: /username/i });
    await user.click(usernameInput);
    await user.keyboard("dummy");

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    await user.click(emailInput);
    await user.keyboard("takanogi2468@gmail.com");

    const submitButton = screen.getByRole("button", {
      name:/send password reset link/i,
    });
    await user.click(submitButton);

    expect(axios.post).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith("/auth/forgetpassword", {
      username: "dummy",
      email: "takanogi2468@gmail.com",
    });

    expect(screen.getByText("An unexpected error outside axios error occurred")).toBeInTheDocument();
  });



  it("the link to '/login' has to lead to '/login'", async () => {
    renderComponent()
    const loginLink = screen.getByRole("link", {
      name:/back to login/i
    })
    expect(loginLink).toBeInTheDocument()
    await user.click(loginLink)
    expect(window.location.pathname).toBe("/login")
  })

});
