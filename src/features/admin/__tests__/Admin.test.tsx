import { configureStore } from "@reduxjs/toolkit";
import usersReducer, { UserPreloadedStateType } from "../../users/usersSlice";
import { Provider } from "react-redux";
import Admin from "../Admin";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";



jest.mock("../../users/usersSlice", () => ({
  ...jest.requireActual("../../users/usersSlice"),
  //   モジュールの実際の内容を取得して展開（スプレッド）します。
  // 理由: deleteUser以外のエクスポート（たとえばfetchUsersやデフォルトのReducerなど）は実際の実装を使用するため。。
  deleteUser: jest.fn(() => ({
    type: "users/deleteUser/fulfilled",
    payload: { _id: "1" },
    // 特定の動作（成功時のアクション）を再現
    // deleteUserはcreateAsyncThunkで定義された非同期アクションなので、以下のような形のアクションを返す必要があります →type + payload
  })),
}));

const renderComponent = () => {

  const preloadedState: UserPreloadedStateType = {
    users: {
      users: [
        { _id: "1", username: "Daichi", roles: [1] },
        { _id: "2", username: "Takahiro", roles: [2] },
      ],
      status: "idle", 
      error: "",
    },
  };

  const store = configureStore({
    reducer: { users: usersReducer },
    preloadedState,
  });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    </Provider>
  );
  return store;
};


describe("Admin - rendering", () => {

  it("should render the number of li element we expect", () => {
    renderComponent();
    const listElements = screen.getAllByRole("listitem");
    expect(listElements).toHaveLength(2);
  });
});




describe("Admin - behavior", () => {

  it("deleteUser Action has to be called when clicked", async () => {
    const store = renderComponent();
    const firstButton = screen.getAllByRole("button", {
      name: /delete user/i,
    })[0];
    expect(firstButton).toBeInTheDocument();

    // const listElements = await screen.findAllByRole("listitem");
    // expect(listElements).toHaveLength(2);
    // await user.click(firstButton);
    // const listElementsAfterButtonClick = await screen.findAllByRole("listitem");
    // expect(listElementsAfterButtonClick).toHaveLength(1);

    let state = store.getState();
    let usersArray = state.users.users;
    expect(usersArray).toHaveLength(2);
    await user.click(firstButton);
    state = store.getState(); 
    usersArray = state.users.users;
    expect(usersArray).toHaveLength(1);
    expect(usersArray[0].username).toBe("Takahiro");
  });


  it("the link to '/' has to lead to '/'", async () => {
    renderComponent();
    const homeLink = screen.getByRole("link", {
      name: /home/i,
    });
    expect(homeLink).toBeInTheDocument();
    await user.click(homeLink);
    expect(window.location.pathname).toBe("/");
  });
});
