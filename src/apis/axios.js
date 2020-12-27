import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react"
import axios from "axios"
import { AuthContext } from "../context/auth"

export const UnsplashAPI = (options, baseURL) => {
  // const authorizationToken = JSON.parse(
  //   localStorage.getItem("unsplashAuthToken")
  // ).validateToken
  const { REACT_APP_UNSPLASH_API_URL } = process.env

  return axios.create({
    baseURL: REACT_APP_UNSPLASH_API_URL,
    headers: {
      Authorization:
        "Client-ID 8e31e45f4a0e8959d456ba2914723451b8262337f75bcea2e04ae535491df16d",
      ...options,
    },
  })
}
