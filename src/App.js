import React, { useState, useRef, useCallback } from 'react'
import 'main.scss'
import 'App.scss'
import useInfiniteScroller from 'utils/useInfiniteScroller/useInfiniteScroller'

// // https://pixabay.com/api/
// const baseUrl = 'https://pixabay.com/api/?'

// const makeQuery = (query, pageNumber = 1) =>
//   `${baseUrl}key=${process.env.REACT_APP_PIXA_KEY}&q=${query}&page=${pageNumber}`

export default function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const { images, hasMore, loading, error } = useInfiniteScroller(
    query,
    pageNumber,
  )

  const observer = useRef()
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <>
      <input type="text" value={query} onChange={handleSearch}></input>
      {images.map((image, index) => {
        if (images.length === index + 1) {
          return (
            <img
              ref={lastElementRef}
              src={image}
              key={image}
              alt="preview"
            ></img>
          )
        }
        return <img src={image} key={image} alt="preview"></img>
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </>
  )
}
