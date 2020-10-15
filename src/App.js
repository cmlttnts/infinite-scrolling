import React, { useState, useRef, useCallback } from 'react'
import 'main.scss'
import 'App.scss'
import useInfiniteScroller from 'utils/useInfiniteScroller/useInfiniteScroller'

export default function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const { images, hasMore, loading, error } = useInfiniteScroller(
    query,
    pageNumber,
  )
  const lastPageUpdate = useRef(Date.now())

  const observer = useRef()
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            if (Date.now() - lastPageUpdate.current > 700) {
              setPageNumber((prevPageNumber) => prevPageNumber + 1)
              lastPageUpdate.current = Date.now()
            }
          }
        },
        { threshold: 0.75 },
      )
      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <div className="App">
      <p>Using Pixabay&apos;s Api</p>
      <div className="SearchBox">
        <label htmlFor="search">Search</label>
        <input type="text" id="search" value={query} onChange={handleSearch} />
      </div>
      {images.map((image, index) => {
        if (images.length === index + 1) {
          return (
            <img ref={lastElementRef} src={image} key={image} alt="preview" />
          )
        }
        return <img src={image} key={image} alt="preview" />
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </div>
  )
}
