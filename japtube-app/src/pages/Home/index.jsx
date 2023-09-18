import classNames from 'classnames/bind'
import styles from './Home.module.scss'
import ExploreBanner from './components/Explore/ExploreBanner'
import VideoList from './components/VideoList/VideoList'
import CategoryList from './components/CategoryList/CategoryList'
import { useEffect, useState, useContext } from 'react'
import FilmPlayContext from '../../context/PlayFilmContext/FilmPlayContext'
import UserContext from '../../context/UserContext/UserContext'
import { changeFilm, changeVideo, getList } from '../../store/action'

const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function Home() {
    const [filmList, setFilmList] = useState([])
    const [allFilms, setAllFilms] = useState([])
    const { user } = useContext(UserContext)
    const { dispatchFilmPlay, dispatchVideoPlay } = useContext(FilmPlayContext)

    //get all films
    useEffect(() => {
        getAllFilmList()
        getFavoriteList()
        dispatchFilmPlay(changeFilm(null))
        dispatchVideoPlay(changeVideo(null))
    }, [])

    const getAllFilmList = async () => {
        try {
            const allFilmFetch = await fetch(API_URL + '/api/v1/films')
            const res = await allFilmFetch.json()
            setFilmList(res)

            setAllFilms(res)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const filterFilmList = (data) => {
        setFilmList(data)
    }

    //----------------------------------get Favorite List--------------------------
    const { dispatchLikedFilms } = useContext(FilmPlayContext)

    //get Favorite list
    const getFavoriteList = async () => {
        if (!user) {
            return
        }
        try {
            const allFilmFetch = await fetch(API_URL + '/api/v1/films/favorite-list/' + user.id)
            const res = await allFilmFetch.json()

            //list films liked
            const likedFilmsList = res.map((likedFilm) => {
                return likedFilm.film
            })

            console.log('likedFilmList', likedFilmsList)

            //get user favorite list + save to context
            dispatchLikedFilms(getList(likedFilmsList))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={cx('container')}>
            <ExploreBanner />
            <CategoryList filmList={allFilms} filterFilmList={filterFilmList} />
            <VideoList filmList={filmList} />
        </div>
    )
}
