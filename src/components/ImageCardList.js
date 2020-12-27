import React, {
  useEffect,
  useState,
  Fragment,
  useRef,
  useMemo,
  useLayoutEffect,
  useContext,
} from "react"
import ImageCard from "./ImageCard"
import imagesLoaded from "imagesloaded"

const ImageCardList = ({ images, onImageClicked }) => {
  const [perPageCount, setPerPageCount] = useState(25)
  const [state, setState] = useState("loading")
  useEffect(() => {
    let loaded = 0
    let cards = document.getElementsByClassName("image-card")
    console.log(cards, "cards")
    for (let i = 0; i < cards.length; i++) {
      imagesLoaded(cards[i], (instance) => {
        if (instance.isComplete) loaded++
        if (loaded === perPageCount) setState("loaded")
      })
    }
  }, [images, perPageCount])

  function resizeMasonryItem(item) {
    let grid = document.getElementsByClassName("masonry")[0],
      rowGap = parseInt(
        window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
      ),
      rowHeight = parseInt(
        window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
      )
    let rowSpan = Math.ceil(
      (item.querySelector(".masonry-content").getBoundingClientRect().height +
        rowGap) /
        (rowHeight + rowGap)
    )
    item.style.gridRowEnd = "span " + rowSpan
  }

  function resizeAllMasonryItems() {
    let allItems = document.getElementsByClassName("masonry-brick")
    for (let i = 0; i < allItems.length; i++) {
      resizeMasonryItem(allItems[i])
    }
  }

  useEffect(() => {
    window.addEventListener("load", resizeAllMasonryItems)
    return () => {
      window.removeEventListener("load", resizeAllMasonryItems)
    }
  }, [])

  useEffect(() => {
    window.addEventListener("resize", resizeAllMasonryItems)
    return () => {
      window.removeEventListener("resize", resizeAllMasonryItems)
    }
  }, [])

  function waitForImages() {
    let allItems = document.getElementsByClassName("masonry-brick")
    for (let i = 0; i < allItems.length; i++) {
      imagesLoaded(allItems[i], (instance) => {
        const item = instance.elements[0]
        const cardForegroundEl = instance.images[0].img.parentElement.parentElement.querySelector(
          ".image-card-fg"
        )
        item.style.display = "block"
        let t = setTimeout(() => {
          cardForegroundEl.classList.add("hide")
          clearTimeout(t)
        }, 200 + +cardForegroundEl.parentElement.getAttribute("data-card-index") * 120)
        resizeMasonryItem(item)
      })
    }
  }

  useEffect(() => {
    waitForImages()
  }, [images])

  return (
    <div className="masonry">
      {images.map((image, index) => (
        <ImageCard
          imageData={image}
          key={image.id}
          imageIndex={index}
          onImageClicked={(img) => onImageClicked(img)}
        />
      ))}
    </div>
  )
}

export default ImageCardList
