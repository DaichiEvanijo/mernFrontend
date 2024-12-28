import { render } from "@testing-library/react"
import { Provider } from "react-redux"
import RequireAuth from "../RequireAuth"
import { configureStore } from "@reduxjs/toolkit"
import authReducer, { AuthPreloadedType } from "../../auth/authSlice"
import { BrowserRouter, Navigate } from "react-router-dom"

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Navigate:jest.fn(() => null)
}))


const renderComponent = (preloadedState:AuthPreloadedType, allowedRoles:number[]) => {
  const store = configureStore({
    reducer:{auth:authReducer},
    preloadedState,
  })
  render(
    <Provider store={store}>
      <BrowserRouter>
        <RequireAuth allowedRoles={allowedRoles}/>
      </BrowserRouter>
    </Provider>
  )
}

describe("RequiredAuth - behavior", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });


  it("should render <Outlet/> when role matches",() => {
    const preloadedState: AuthPreloadedType = {
      auth: {
        username: "Daichi",
        accessToken: "akakkakakakakaka",
        roles: [2001],
      },
    };
    renderComponent(preloadedState,[2001])

    expect(Navigate).not.toHaveBeenCalled()
  })


  it("should render Unauthorized Component when role does not match but user already logged in",() => {
    const preloadedState:AuthPreloadedType ={
      auth:{
        username:"Daichi",
        accessToken:"akakkakakakakaka",
        roles:[2001]
      }
    } 
    renderComponent(preloadedState, [5150])

    expect(Navigate).toHaveBeenCalledWith(
      expect.objectContaining({to:"/unauthorized"} ),
      expect.anything() 
    )
  })
// Navigate は通常、2つの引数で呼び出されます：
// 最初の引数: <Navigate> コンポーネントに渡される props オブジェクト。
// ここで主に to, state, replace などのプロパティが確認されます。
// 2番目の引数: React の内部的な用途に使われる引数（通常は context に関連するもの）。


  it("should render Login Component when user still did not log in",() => {
    const preloadedState: AuthPreloadedType = {
      auth: {
        username:null, 
        accessToken:null,
        roles:[]
      },
    };
    renderComponent(preloadedState,[2001])
    
    expect(Navigate).toHaveBeenCalledWith(
      expect.objectContaining({to:"/login"}),
      expect.anything()
    )
  })
})