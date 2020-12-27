import React, {
  useEffect,
  useState,
  Fragment,
  useRef,
  useMemo,
  useLayoutEffect,
  useContext,
} from "react"

import Header from "./components/Header"
import Modal from "./components/Modal"
import axios from "axios"
import imagesLoaded from "imagesloaded"
import "./styles/App.scss"
import { UnsplashAPI } from "./apis/axios"
import debounce from "lodash.debounce"
import { AuthProvider } from "./context/auth"
import { Switch, Route, useLocation } from "react-router-dom"

import Home from "./pages/Home"
import TopicDetail from "./pages/TopicDetail"
import UserDetail from "./pages/UserDetail"

// const API = process.env.REACT_APP_API_URL
// const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
const API = "https://api.unsplash.com"
const CLIENT_ID =
  "8e31e45f4a0e8959d456ba2914723451b8262337f75bcea2e04ae535491df16d"
const DEFAULT_IMAGE_COUNT = 25
const IMAGE_INCREMENT_COUNT = 10

function App() {
  let location = useLocation()
  const [images, setImages] = useState([])
  const [query, setQuery] = useState("")
  const [prevQuery, setPrevQuery] = useState("")
  const [clickedImage, setClickedImage] = useState({})
  const [isModalActive, setModalActive] = useState(false)
  const [failedToLoad, setFailedToLoad] = useState(false)
  const [perPageCount, setPerPageCount] = useState(DEFAULT_IMAGE_COUNT)
  const [totalResults, setTotalResults] = useState(0)
  const [state, setState] = useState("loading")
  const [queryChanged, setqueryChanged] = useState(false)
  const [page, setPage] = useState("home")
  const loadButtonEl = useRef()
  const [searchState, setSearchState] = useState({
    query: "",
  })

  const onSearchItemWithDebounce = debounce((query) => {
    setSearchState({
      query: query,
    })
  }, 500)

  const getRandomPhotos = async () => {
    try {
      const res = await UnsplashAPI().get("/photos", {
        params: {
          per_page: DEFAULT_IMAGE_COUNT,
        },
      })
      setImages(res.data)
      if (failedToLoad) {
        setFailedToLoad(false)
      }
    } catch {
      setFailedToLoad(true)
    }
  }
  useEffect(() => {
    if (searchState.query == "") {
      getRandomPhotos()
    }
  }, [failedToLoad, searchState])

  const searchQuery = async (inputValue) => {
    try {
      if (inputValue !== "") {
        setState("loading")
        const res = await UnsplashAPI().get("/search/photos/", {
          params: {
            query: inputValue,
            per_page: perPageCount,
            client_id: CLIENT_ID,
          },
        })
        setImages(res.data.results)
        setTotalResults(res.data.total)
        if (failedToLoad) setFailedToLoad(false)
      }
    } catch {
      setFailedToLoad(true)
    }
  }

  var imgList = document.getElementById("img-list")
  var caroBtns = document.getElementsByClassName("caro-btn")
  var status = 0
  var positionUnit = -100

  function slideImg(x) {
    var i

    for (i = 0; i < caroBtns.length; i++) {
      caroBtns[i].style.backgroundColor = "#ffffff44"
    }
    caroBtns[x].style.backgroundColor = "#fff"
    var position
    position = x * positionUnit
    imgList.style.left = position + "%"
  }

  useLayoutEffect(() => {
    if (searchState.query !== "") {
      searchQuery(searchState.query)
      setPrevQuery(searchState.query)
    }
  }, [searchState])

  useEffect(() => {
    if (page === "home") {
      setQuery("")
      setPrevQuery("")
    }
  }, [page])

  const handleImageClick = (img) => {
    setClickedImage(img)
    setModalActive(true)
  }

  return (
    <AuthProvider>
      <>
        <Header
          onQueryChange={(q) => {
            setQuery(q)
            setqueryChanged(true)
          }}
          onSearchItemWithDebounce={onSearchItemWithDebounce}
          onGenarateRandomImages={() => getRandomPhotos()}
          onPageChange={(p) => setPage(p)}
        />

        {location.pathname == "/" ? (
          <section class="carousell">
            <div class="img-list" id="img-list">
              <img
                data-blurhash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
                src="https://images.unsplash.com/photo-1608640908522-d807e572d9bf?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
                alt="Unsplash Photo"
                width="770"
              />
              <img
                data-blurhash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
                src="https://images.unsplash.com/flagged/photo-1558082517-cd9bb4f65a83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1977&q=80"
                alt="Unsplash Photo"
                width="770"
              />
              <img
                data-blurhash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
                src="https://images.unsplash.com/photo-1561045640-0fdfee0b6e35?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
                alt="Unsplash Photo"
                width="770"
              />
            </div>
            <div class="content">
              <div class="text-content">
                <h2 class="has-text-white title">
                  Explore amazing photos and pictures for free.
                </h2>
                <p class="subtitle has-text-white">
                  The internet’s source of freely-usable images. Powered by
                  creators everywhere.
                </p>
              </div>
            </div>
            <div class="btn-section">
              <div
                class="caro-btn"
                onClick={() => {
                  slideImg(0)
                }}
              ></div>
              <div
                class="caro-btn"
                onClick={() => {
                  slideImg(1)
                }}
              ></div>
              <div
                class="caro-btn"
                onClick={() => {
                  slideImg(2)
                }}
              ></div>
            </div>
          </section>
        ) : null}

        {prevQuery !== "" && searchState.query !== "" ? (
          <div class="section" style={{ paddingTop: 100 }}>
            <span className="text-info">
              <span>
                search results for <strong>"{prevQuery}"</strong>
              </span>
              <span className="total-results">
                found <strong>{totalResults}</strong> matching results
              </span>
            </span>
            {query === "" && queryChanged && !failedToLoad && (
              <h3 className="text-info type-something-info">Type something!</h3>
            )}

            {prevQuery !== "" && totalResults === 0 && (
              <div className="no-image-found-info">
                <h3>No Images Found</h3>
                <span>
                  Try searching <strong>dogs</strong> or <strong>cats</strong>
                </span>
              </div>
            )}
          </div>
        ) : null}

        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <Home
                {...props}
                images={images}
                handleImageClick={handleImageClick}
                onImageClicked={(img) => handleImageClick(img)}
                component={Home}
              />
            )}
          />
          <Route
            exact
            path="/topic/:id"
            render={(props) => (
              <TopicDetail
                {...props}
                handleImageClick={handleImageClick}
                onImageClicked={(img) => handleImageClick(img)}
                component={TopicDetail}
              />
            )}
          />
          <Route
            exact
            path="/user/:id"
            render={(props) => (
              <UserDetail
                {...props}
                handleImageClick={handleImageClick}
                onImageClicked={(img) => handleImageClick(img)}
                component={UserDetail}
              />
            )}
          />
        </Switch>

        {isModalActive && (
          <Modal
            imageData={clickedImage}
            onModalActive={(isActive) => setModalActive(isActive)}
          />
        )}
      </>
    </AuthProvider>
  )
}

export default App
