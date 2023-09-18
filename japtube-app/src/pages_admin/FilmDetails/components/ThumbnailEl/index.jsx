import React from 'react'
const API_URL = 'http://localhost:8080'
import { useState, useEffect } from 'react'

export default function ThumbnailEl({ row }) {
    const [apiData, setApiData] = useState(null)

    useEffect(() => {
        const getThumbnail = async () => {
            if (row.original.thumbnail) {
                const thumbnailFetch = await fetch(API_URL + row.original.thumbnail)
                const res = await thumbnailFetch.blob()
                const fetchedData = URL.createObjectURL(res)
                setApiData(fetchedData)
            } else {
                setApiData(
                    'https://www.keytechinc.com/wp-content/uploads/2022/01/video-thumbnail.jpg'
                )
            }
        }
        getThumbnail()
    }, [row.original.id])

    return <img src={apiData}></img>
}
