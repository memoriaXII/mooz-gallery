import React from "react"
import App from "./App"
import { BrowserRouter as Router, Switch, useLocation } from "react-router-dom"
import { hydrate, render } from "react-dom"

render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
)
