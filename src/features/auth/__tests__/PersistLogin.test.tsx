import { render, screen, waitFor } from "@testing-library/react";
import PersistLogin from "../PersistLogin";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { AuthPreloadedType } from "../../auth/authSlice";
import axios from "../../../api/axios";
import useLocalStorage from "../../../hooks/useLocalStorage";


// jest.mock("../../../api/axios");

jest.mock("../../../hooks/useLocalStorage", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const renderComponent = (preloadedState:AuthPreloadedType, persistValue:boolean) => {
  // useLocalStorage.mockReturnValue([persistValue]);
  (useLocalStorage as jest.Mock).mockReturnValue([persistValue]);

  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });
  render(
    <Provider store={store}>
      <BrowserRouter>
        <PersistLogin />
      </BrowserRouter>
    </Provider>
  );
};


describe("PersistLogin - behavior", () => {
  it("should display 'is Loading...' when persist is true, then token is not available/refresh is successful ending with <Outlet/>", async () => {
    const preloadedState: AuthPreloadedType = {
      auth: {
        username: null,
        accessToken: null,
        roles: [],
      },
    };
    renderComponent(preloadedState, true)

    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: { message: "Token refreshed" }
    });


    expect(screen.getByText("is Loading...")).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText("is Loading...")).not.toBeInTheDocument();
    });
  })



  it("should not display 'is Loading...' when persist is false ending with <Outlet/>", () => {
    const preloadedState: AuthPreloadedType = {
      auth: {
        username: null,
        accessToken: null,
        roles: [],
      },
    };
    renderComponent(preloadedState, false);

    expect(screen.queryByText("is Loading...")).not.toBeInTheDocument();
  });
})