import classNames from 'classnames/bind'
import styles from '../../VideoList.module.scss'
import { useEffect, useState } from 'react'
const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function Thumbnail({ thumbnail }) {
    const [imageURL, setImageURL] = useState()

    useEffect(() => {
        const getAvatar = async () => {
            if (thumbnail) {
                try {
                    const avatarFetch = await fetch(API_URL + thumbnail)
                    const blob = await avatarFetch.blob()
                    let avatarUrl = URL.createObjectURL(blob)
                    setImageURL(avatarUrl)
                } catch (error) {
                    console.log(error)
                }
            }
        }
        getAvatar()
    }, [thumbnail])

    return (
        <div>
            <img src={imageURL} alt="" className={cx('thumbnail')} />
        </div>
    )
}
