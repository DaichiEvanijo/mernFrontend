import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './sass/index.scss'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import {store} from "./app/store"
import {Provider} from "react-redux"

import { fetchPosts } from './features/posts/postsSlice.ts'
store.dispatch(fetchPosts())

import {disableReactDevTools} from "@fvilers/disable-react-devtools"

if(process.env.NODE_ENV === "production") disableReactDevTools()


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router basename="/typescript-portfolio2">
        <Routes>
          <Route path="/*" element={<App/>} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
)
