/** @format */

import React, { useState, useEffect, useCallback } from "react"
import { createContext, useContext } from "react"
import queryString from "query-string"
import axios from "axios"
import {
  Link,
  BrowserRouter,
  useHistory,
  useParams,
  useLocation,
} from "react-router-dom"

export const AuthContext = createContext({})

export const AuthProvider = (props) => {
  const [token, setToken] = useState(null)
  let history = useHistory()
  const getToken = () => {
    const windowSetting = typeof window !== "undefined" && window
    return (
      windowSetting &&
      windowSetting.localStorage &&
      JSON.parse(localStorage.getItem("unsplashAuthToken")) &&
      JSON.parse(localStorage.getItem("unsplashAuthToken")).validateToken
    )
  }

  const loginOauth = () => {
    window.location =
      "https://unsplash.com/oauth/authorize?" +
      queryString.stringify({
        client_id: "SY1_0BRFt6Wa8S7TdRLFhFdqTi6dAX28-b5L01SXNxk",
        redirect_uri: "http://localhost:3000",
        response_type: "code",
        grant_type: "authorization_code",
      }) +
      "&scope=public+read_user"
  }

  const logOut = useCallback(() => {
    localStorage.removeItem("unsplashAuthToken")
    setToken(null)
    history.push("/")
  }, [token])

  const LoginAuth = async (queryCode) => {
    try {
      const res = await axios.post("https://unsplash.com/oauth/token", {
        client_id: "SY1_0BRFt6Wa8S7TdRLFhFdqTi6dAX28-b5L01SXNxk",
        redirect_uri: "http://localhost:3000",
        client_secret: "DC8WkUyoPaclt13ceHgqI8_P7mWcNkQmBzXSddjY3VE",
        code: queryCode,
        grant_type: "authorization_code",
      })
      const validateToken = res.data.access_token
      localStorage.setItem(
        "unsplashAuthToken",
        JSON.stringify({
          validateToken,
        })
      )
      setToken(validateToken)
    } catch (e) {
      console.log(e, "e")
    }
  }

  useEffect(() => {
    let parsed = queryString.parse(window.location.search)
    const token = parsed.code
    if (token) {
      LoginAuth(parsed.code)
    } else {
      return
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        loginOauth,
        getToken,
        logOut,
        isLoggedIn: token,
      }}
    >
      <>{props.children}</>
    </AuthContext.Provider>
  )
}
