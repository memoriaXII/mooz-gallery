import React, { useRef, useState, useEffect, useContext } from "react"
import axios from "axios"
import { UnsplashAPI } from "../apis/axios"
import {
  Link,
  BrowserRouter,
  useHistory,
  useParams,
  useLocation,
} from "react-router-dom"
import queryString from "query-string"
import { AuthContext } from "../context/auth"

const Header = ({
  onGenarateRandomImages,
  onPageChange,
  onSearchItemWithDebounce,
}) => {
  const { getToken, loginOauth, logOut, isLoggedIn } = useContext(AuthContext)
  let history = useHistory()
  const [isFloatingInputActive, setFloatingInputActive] = useState(false)
  const [topics, setTopics] = useState([])
  const [userProfile, setUserProfile] = useState({})
  const inputEl = useRef()
  const floatingInputEl = useRef()
  const handleSubmit = (e) => {
    e.preventDefault()
  }
  const handleHomePage = () => {
    history.push("/")
    // onPageChange("home")
    onGenarateRandomImages()
    // inputEl.current.value = ""
    // floatingInputEl.current.value = ""
  }

  const getCurrentUserProfile = async (token) => {
    try {
      const res = await axios.get("https://api.unsplash.com/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUserProfile(res.data)
    } catch (e) {
      console.log(e, "e")
    }
  }

  const getTopics = async (token) => {
    try {
      const res = await UnsplashAPI().get("/topics", {
        params: {
          per_page: 25,
        },
      })
      setTopics(res.data)
    } catch (e) {
      console.log(e, "e")
    }
  }

  useEffect(() => {
    if (getToken()) {
      getCurrentUserProfile(getToken())
    }
    getTopics()
  }, [getToken()])

  return (
    <>
      <header
        class="site-header"
        style={{ position: "fixed", zIndex: 20, width: `${100}%` }}
      >
        <nav class="topbar">
          <div class="header-inner">
            <p
              className="title mt-5 has-text-black is-4"
              onClick={handleHomePage}
            >
              MO/OZ ®
            </p>
            <form onSubmit={handleSubmit}>
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <p class="control has-icons-left has-icons-right">
                      <input
                        type="text"
                        class="input is-rounded is-light search is-small"
                        placeholder="Search"
                        onChange={() =>
                          onSearchItemWithDebounce(inputEl.current.value)
                        }
                        ref={inputEl}
                      />
                      {/* <span class="icon is-small is-right">
                        <a class="delete is-small"></a>
                      </span> */}
                    </p>
                  </div>
                </div>
              </div>
            </form>
            <div class="tags">
              {getToken() ? (
                <div class="dropdown is-hoverable is-right">
                  <div class="dropdown-trigger">
                    <img
                      src={
                        userProfile.profile_image &&
                        userProfile.profile_image.small
                      }
                      alt=""
                    />
                  </div>
                  <div class="dropdown-menu" id="dropdown-menu4" role="menu">
                    <div class="dropdown-content">
                      <a href="#" class="dropdown-item">
                        Overview
                      </a>
                      <a
                        class="dropdown-item"
                        onClick={() => {
                          history.push(`/user/${userProfile.id}`)
                        }}
                      >
                        View Profile
                      </a>
                      <a href="#" class="dropdown-item">
                        Account setting
                      </a>
                      <a class="dropdown-item" onClick={logOut}>
                        Log Out
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <button class="button is-small is-black" onClick={loginOauth}>
                  Login
                </button>
              )}
            </div>
          </div>
          <div class="top-line">
            <div class="slider no-scrollbar">
              <div class="card-container">
                {topics.map((item, index) => {
                  return (
                    <span
                      key={item.id}
                      class={index == 0 ? "tag p-3 is-black" : "tag ml-2 p-3"}
                      onClick={() => {
                        history.push(`/topic/${item.id}`)
                      }}
                    >
                      {item.title}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Header
