import React, { useRef, useState, useEffect, useContext } from "react"
import axios from "axios"
import { UnsplashAPI } from "../../apis/axios"
import {
  Link,
  BrowserRouter,
  useHistory,
  useParams,
  useLocation,
} from "react-router-dom"
import queryString from "query-string"
import { AuthContext } from "../../context/auth"
import ImageCardList from "../../components/ImageCardList"

export default ({ onImageClicked, handleImageClick }) => {
  let location = useLocation()
  const { getToken, loginOauth, logOut, isLoggedIn } = useContext(AuthContext)
  const [currentUserProfile, setCurrentUserProfile] = useState({})
  const [currentUserPhotos, setCurrentUserPhotos] = useState([])
  const [currentUserLikePhotos, setCurrentUserLikePhotos] = useState([])
  const [currentUserCollections, setCurrentUserCollections] = useState([])
  let history = useHistory()
  const getCurrentUserProfile = async (id) => {
    try {
      const res = await UnsplashAPI().get(`/users/${id}`)
      setCurrentUserProfile(res.data)
      console.log(res.data, "data")
    } catch (e) {
      console.log(e, "e")
    }
  }

  const getCurrentUserPhotos = async (id) => {
    try {
      const res = await UnsplashAPI().get(`/users/${id}/photos`)
      console.log(res.data, "data")
      setCurrentUserPhotos(res.data)
    } catch (e) {
      console.log(e, "e")
    }
  }

  const getUserData = async (id) => {
    const res1 = await UnsplashAPI().get(`/users/${id}/photos`)
    const res2 = await UnsplashAPI().get(`/users/${id}/likes`)
    const res3 = await UnsplashAPI().get(`/users/${id}/collections`)
    axios
      .all([res1, res2, res3])
      .then(
        axios.spread((...responses) => {
          const res1 = responses[0]
          const res2 = responses[1]
          const res3 = responses[2]
          console.log(res1, res2, res3, "all")
          setCurrentUserPhotos(res1.data)
          setCurrentUserLikePhotos(res2.data)
          setCurrentUserCollections(res3.data)
        })
      )
      .catch((errors) => {
        // react on errors.
      })
  }

  useEffect(() => {
    if (location) {
      var pararm_id = location.pathname.substring(
        location.pathname.lastIndexOf("/") + 1
      )
      getCurrentUserProfile(pararm_id)
      getUserData(pararm_id)
    }
  }, [location.pathname])
  return (
    <>
      <section class="hero is-medium  is-bold" style={{ paddingTop: 70 }}>
        <div class="hero-body has-text-centered">
          <div class="container">
            <div class="columns mr-5">
              <div class="column is-6 has-text-right">
                <img
                  src={
                    currentUserProfile.profile_image &&
                    currentUserProfile.profile_image.large
                  }
                  alt=""
                  style={{ borderRadius: `${50}%` }}
                />
              </div>
              <div class="column is-6 has-text-left">
                <h1 class="title has-text-black">{currentUserProfile.name}</h1>
                <h2 class="subtitle has-text-black">
                  {currentUserProfile.bio}
                </h2>
                <p>{currentUserProfile.location}</p>
                <p>
                  interest:
                  <div class="tags">
                    {currentUserProfile.tags &&
                      currentUserProfile.tags.custom &&
                      currentUserProfile.tags.custom.map((item, index) => {
                        return (
                          <span
                            key={index}
                            class={index == 0 ? "tag p-3 ml-2" : "tag ml-2 p-3"}
                          >
                            {item.title}
                          </span>
                        )
                      })}
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="sticky">
        <TabsGroup
          onImageClicked={(img) => handleImageClick(img)}
          images={currentUserPhotos}
          currentUserPhotos={currentUserPhotos}
          currentUserLikePhotos={currentUserLikePhotos}
          currentUserCollections={currentUserCollections}
        />
      </div>
    </>
  )
}

const Tabs = (props) => {
  const [selected, setSelected] = useState(props.selected || 0)
  function handleChange(index) {
    setSelected(index)
  }

  return (
    <div>
      <div className="tabs mt-4 is-centered">
        <ul>
          {props.children.map((elem, index) => {
            let style = index == selected ? "is-active" : ""
            return (
              <li
                className={style}
                key={index}
                onClick={() => {
                  handleChange(index)
                }}
              >
                {/* <img
                  style={index == selected ? { filter: `invert(1)` } : {}}
                  src={elem.props.icon}
                  alt=""
                /> */}
                <a class="has-text-black">{elem.props.title}</a>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="content">{props.children[selected]}</div>
    </div>
  )
}

const TabsGroup = ({
  onImageClicked,
  handleImageClick,
  currentUserPhotos,
  currentUserLikePhotos,
  currentUserCollections,
}) => {
  return (
    <Tabs selected={0}>
      <TabsContent title="Photos">
        <ImageCardList
          onImageClicked={(img) => handleImageClick(img)}
          images={currentUserPhotos}
        />
      </TabsContent>
      <TabsContent title="Likes">
        <ImageCardList
          onImageClicked={(img) => handleImageClick(img)}
          images={currentUserLikePhotos}
        />
      </TabsContent>
      <TabsContent title="Collections">
        <div class="columns is-multiline">
          {currentUserCollections.map((item, index) => {
            return (
              <div class="card column is-3" key={item.id}>
                <div class="card-top">
                  <a href="">
                    {item.preview_photos.slice(0, 1).map((item, index) => {
                      return (
                        <img
                          src={item && item.urls && item.urls.regular}
                          alt="Unsplash Photo"
                        />
                      )
                    })}
                  </a>
                </div>
                <div class="card-content">
                  <a href="">
                    <h3 class="title is-5">{item.title}</h3>
                  </a>
                  <p class="subtitle is-6">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </TabsContent>
    </Tabs>
  )
}

const TabsContent = (props) => {
  return <div>{props.children}</div>
}
