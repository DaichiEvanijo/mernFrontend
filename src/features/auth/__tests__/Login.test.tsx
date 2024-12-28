import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";
import { render, screen } from "@testing-library/react";
import { AuthPreloadedType } from "../authSlice";
import authReducer from "../../auth/authSlice";
import axios from "../../../api/axios";
import user from "@testing-library/user-event";


const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useLocation: () => ({
    state: { from: { pathname: "/dashboard" } },
  }),
}));


const renderComponent = () => {
  const preloadedState: AuthPreloadedType = {
    auth: {
      username: null,
      accessToken: null,
      roles: [],
    },
  };
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
  return store;
};

describe("Login - behavior", () => {
  it("form submittion with axios.post / setAuth Action / navigation", async () => {
    const store = renderComponent();

    jest.spyOn(axios, "post").mockResolvedValueOnce({
        data: { roles: 2001, accessToken: "fargaogoago2" },
      });


    const usernameInput = screen.getByRole("textbox", { name: /username/i });
    await user.click(usernameInput);
    await user.keyboard("Daichi");

    const passwordInput = screen.getByLabelText(/password/i)
    await user.click(passwordInput);
    await user.keyboard("Aa$12345");


    let state = store.getState();
    let username = state.auth.username;
    expect(username).toBe(null);

    const submitButton = screen.getByRole("button", {
      name: /sign in/i,
    });
    await user.click(submitButton);

    // API call check
    expect(axios.post).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(
      "/auth",
      JSON.stringify({
        user: "Daichi",
        pwd: "Aa$12345",
      }),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    
    // setAuth action check
    state = store.getState();
    username = state.auth.username;
    expect(username).toBe("Daichi");
    

    
    expect(mockedNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
  });
});
