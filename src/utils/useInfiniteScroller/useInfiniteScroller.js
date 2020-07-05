import { useEffect, useState } from 'react'
import axios from 'axios'

function useInfiniteScroller(query, pageNumber) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [images, setImages] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setImages([])
  }, [query])

  useEffect(() => {
    let cancel
    if (query === '') {
      console.log('query empty, returning')
      setLoading(false)
      setError(false)
      return () => {
        cancel = true
      }
    }
    setLoading(true)
    setError(false)
    axios({
      method: 'GET',
      url: `https://pixabay.com/api/?key=17300653-639be655694062aab8cd3f5ab&q=${query}&page=${pageNumber}`,
      cancelToken: new axios.CancelToken((c) => {
        cancel = c
      }),
    })
      .then((res) => {
        setImages((prevImages) => [
          ...new Set([
            ...prevImages,
            ...res.data.hits.map((b) => b.previewURL),
          ]),
        ])
        setHasMore(res.data.hits.length > 0)
        setLoading(false)
      })
      .catch((e) => {
        if (axios.isCancel(e)) return
        setError(true)
        console.log(e)
      })
    return () => cancel()
  }, [query, pageNumber])

  return { loading, error, images, hasMore }
}

export default useInfiniteScroller
