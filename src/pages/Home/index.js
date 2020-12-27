import React from "react"
import ImageCardList from "../../components/ImageCardList"

export default ({ images, onImageClicked, handleImageClick }) => {
  return (
    <>
      <ImageCardList
        images={images}
        onImageClicked={(img) => handleImageClick(img)}
      />
    </>
  )
}
