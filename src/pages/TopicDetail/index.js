import React, { useRef, useState, useEffect, useContext } from "react"
import {
  Link,
  BrowserRouter,
  useHistory,
  useParams,
  useLocation,
} from "react-router-dom"
import { AuthContext } from "../../context/auth"
import { UnsplashAPI } from "../../apis/axios"
import { BlurhashCanvas } from "react-blurhash"
import ImageCardList from "../../components/ImageCardList"
import imagesLoaded from "imagesloaded"

export default ({ onImageClicked, handleImageClick }) => {
  const useProgressiveImage = (src) => {
    const [sourceLoaded, setSourceLoaded] = useState(null)
    useEffect(() => {
      const img = new Image()
      img.src = src
      img.onload = () => setSourceLoaded(src)
    }, [src])

    return sourceLoaded
  }

  let location = useLocation()
  const { getToken, loginOauth, logOut, isLoggedIn } = useContext(AuthContext)
  const [topicDes, setTopicDes] = useState({})
  const [topicPhotos, setTopicPhotos] = useState([])
  const [perPageCount, setPerPageCount] = useState(25)

  const getTopicDetail = async (id) => {
    try {
      const res = await UnsplashAPI().get(`/topics/${id}`, {
        params: {
          per_page: 25,
        },
      })
      setTopicDes(res.data)
    } catch (e) {
      console.log(e, "e")
    }
  }
  const getTopicPhotos = async (id) => {
    try {
      const res = await UnsplashAPI().get(`/topics/${id}/photos`, {
        params: {
          per_page: 25,
        },
      })
      console.log(res, "det")
      setTopicPhotos(res.data)
    } catch (e) {
      console.log(e, "e")
    }
  }

  useEffect(() => {
    if (location) {
      var pararm_id = location.pathname.substring(
        location.pathname.lastIndexOf("/") + 1
      )
      getTopicDetail(pararm_id)
      getTopicPhotos(pararm_id)
    }
  }, [location.pathname])

  const loaded = useProgressiveImage(
    topicDes.cover_photo &&
      topicDes.cover_photo.urls &&
      topicDes.cover_photo.urls.full
  )

  return (
    <>
      <section class="carousell">
        <div class="img-list" id="img-list">
          <img src={loaded} alt="Unsplash Photo" />
          <div class="content">
            <div class="text-content">
              <h2 class="has-text-white title">{topicDes && topicDes.title}</h2>
              <p class="subtitle has-text-white">
                {topicDes && topicDes.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ImageCardList
        onImageClicked={(img) => handleImageClick(img)}
        images={topicPhotos}
      />
    </>
  )
}
