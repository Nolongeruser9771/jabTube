import classNames from 'classnames/bind'
import styles from './Search.module.scss'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CategoryList from '../Home/components/CategoryList/CategoryList'
import VideoList from '../Home/components/VideoList/VideoList'
const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function Search() {
    const [allFilms, setAllFilms] = useState([])
    const [filmList, setFilmList] = useState([])
    const { searchValue } = useParams()

    //get film by search
    useEffect(() => {
        const getFilmBySearch = async () => {
            try {
                const searchFetch = await fetch(
                    API_URL + `/api/v1/films/search?searchValue=${encodeURIComponent(searchValue)}`
                )
                const res = await searchFetch.json()
                if (!res.message) {
                    setFilmList(res)
                }
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        }
        getFilmBySearch()
    }, [searchValue])

    //get film by search by pulished at
    useEffect(() => {
        getAllFilmList()
    }, [])
    const getAllFilmList = async () => {
        try {
            const allFilmFetch = await fetch(API_URL + '/api/v1/films')
            const res = await allFilmFetch.json()
            if (!res.message) {
                setAllFilms(res)
            }
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const filterFilmList = (data) => {
        setFilmList(data)
    }

    return (
        <div className={cx('container')}>
            <CategoryList filmList={allFilms} filterFilmList={filterFilmList} />
            <VideoList filmList={filmList} />
        </div>
    )
}
