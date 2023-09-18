import classNames from 'classnames/bind'
import styles from './History.module.scss'
const API_URL = 'http://localhost:8080'
import PreviewFrame from '../FavoriteFilm/components/PreviewFrame'
import YourVideoList from './components/YourVideoList'
import { useContext, useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import UserContext from '../../context/UserContext/UserContext'

const cx = classNames.bind(styles)

export default function History() {
    //sau khi làm xong login thì lưu id vào localstorage và lấy ra userId
    const [watchedFilms, setWatchedFilms] = useState([])
    const { user } = useContext(UserContext)
    useEffect(() => {
        //get Favorite list
        if (!user) {
            return
        }
        const getWatchedFilms = async () => {
            try {
                const allVideoFetch = await fetch(API_URL + '/api/v1/videos/watched-videos?userId=' + user.id)
                const res = await allVideoFetch.json()
                console.log(res)
                setWatchedFilms(res)
            } catch (error) {
                console.log(error)
            }
        }
        getWatchedFilms()
    }, [])

    const [previewFilm, setPreviewFilm] = useState()
    const [lastWatched, setLastWatched] = useState()

    const setVideoPreviewHandle = (videoId, isFree, episode, filmId) => {
        setPreviewFilm({ videoId: videoId, isFree: isFree, ep: episode, filmId })
    }

    return (
        <div className={cx('container')}>
            <div className={cx('preview-frame-container')}>
                <PreviewFrame
                    title={'Video đã xem'}
                    total={watchedFilms.length}
                    unit={'videos'}
                    previewFilm={previewFilm}
                    videoList={watchedFilms}
                />
            </div>
            <div className={cx('video-list-container')}>
                <YourVideoList videoList={watchedFilms} setVideoPreviewHandle={setVideoPreviewHandle} />
            </div>
        </div>
    )
}
