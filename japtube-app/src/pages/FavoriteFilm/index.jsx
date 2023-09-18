import classNames from 'classnames/bind'
import styles from './FavoriteFilm.module.scss'
const API_URL = 'http://localhost:8080'
import PreviewFrame from './components/PreviewFrame'
import FavoriteVideolist from './components/YourFilmList'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import UserContext from '../../context/UserContext/UserContext'

const cx = classNames.bind(styles)

export default function FavoriteFilm() {
    //sau khi làm xong login thì lưu id vào localstorage và lấy ra userId
    const [favoriteList, setFavoriteList] = useState([])
    const { user } = useContext(UserContext)

    useEffect(() => {
        //get Favorite list
        const getFavoriteList = async () => {
            try {
                const allFilmFetch = await fetch(API_URL + '/api/v1/films/favorite-list/' + user.id)
                const res = await allFilmFetch.json()
                setFavoriteList(res)
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        }
        getFavoriteList()
    }, [])

    const [previewFavFilm, setPreviewFavFilm] = useState()

    const setPreviewFilmHandle = async (filmId) => {
        try {
            const videoFetch = await fetch(API_URL + `/api/v1/videos/get-video?filmId=${filmId}&ep=1`)
            const res = await videoFetch.json()
            if (!res.message) {
                setPreviewFavFilm({ videoId: res.id, isFree: res.isFree, filmId: filmId, ep: 1 })
            } else {
                console.log(res.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={cx('container')}>
            <div className={cx('preview-frame-container')}>
                <PreviewFrame
                    title={'Phim đã thích'}
                    total={favoriteList.length}
                    unit={'phim'}
                    filmList={favoriteList}
                    previewFavFilm={previewFavFilm}
                />
            </div>
            <div className={cx('video-list-container')}>
                <FavoriteVideolist filmList={favoriteList} setPreviewFilmHandle={setPreviewFilmHandle} />
            </div>
        </div>
    )
}
