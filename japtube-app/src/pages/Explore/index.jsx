import classNames from 'classnames/bind'
import styles from './Explore.module.scss'
const API_URL = 'http://localhost:8080'
import { useEffect, useState } from 'react'
import CategoryList from '../Home/components/CategoryList/CategoryList'
import VideoList from '../Home/components/VideoList/VideoList'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import VideoSlider from './components/VideoSlide'
import Thumbnail from '../Home/components/VideoList/components/Thumbnail/Thumbnail'
import MDEditor, { commands, title } from '@uiw/react-md-editor'
import Level from '../Home/components/VideoList/components/Level/Level'
import { Link } from 'react-router-dom'
import moment from 'moment'

const cx = classNames.bind(styles)

export default function Explore() {
    //--------------------------------get film list by all and by category --------------------
    const [filmList, setFilmList] = useState([])
    const [allFilms, setAllFilms] = useState([])
    const [videoList, setVideoList] = useState([])

    //get all films
    useEffect(() => {
        getAllFilmList()
        getNewUpdatedVideo()
        setRandomFilm(allFilms[0])
    }, [])

    const getNewUpdatedVideo = async () => {
        try {
            const allVideoFetch = await fetch(API_URL + '/api/v1/videos/all')
            const res = await allVideoFetch.json()
            setVideoList(res)

            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllFilmList = async () => {
        try {
            const allFilmFetch = await fetch(API_URL + '/api/v1/films')
            const res = await allFilmFetch.json()
            setFilmList(res)

            setAllFilms(res)
        } catch (error) {
            console.log(error)
        }
    }

    const filterFilmList = (data) => {
        setSelectedLevel()
        setFilmList(data)
    }
    //--------------Level select------------------
    const [selectedLevel, setSelectedLevel] = useState()

    //--------------Random film------------------
    const [randomFilm, setRandomFilm] = useState()

    const randomFilmHandle = () => {
        if (allFilms.length > 0) {
            let randomFilmIndex = Math.floor(Math.random() * allFilms.length)
            console.log(allFilms)
            console.log('random index', randomFilmIndex)

            //get film by id
            let randomId = allFilms[randomFilmIndex].id
            console.log(randomId)
            getFilmById(randomId)
        }
    }

    const getFilmById = async (filmId) => {
        const filmFetch = await fetch(API_URL + '/api/v1/films/' + filmId)
        const res = await filmFetch.json()
        if (!res.message) {
            setRandomFilm(res)
            console.log(res)
        } else {
            console.log(res.message)
        }
    }
    return (
        <div className={cx('container')}>
            <div className={cx('category')}>Tập phim mới cập nhật</div>
            <Swiper
                spaceBetween={20}
                slidesPerView={4}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
            >
                {videoList ? (
                    videoList.map((video) => (
                        <SwiperSlide key={video.id}>
                            <VideoSlider video={video} />
                        </SwiperSlide>
                    ))
                ) : (
                    <></>
                )}
            </Swiper>

            <div className={cx('category')} style={{ marginTop: '10px' }} onClick={() => randomFilmHandle()}>
                Chọn phim ngẫu nhiên
            </div>
            <div className={cx('random-film-container')}>
                {randomFilm ? (
                    <>
                        <div className={cx('random-film-info')}>
                            <h2>{randomFilm.title}</h2>
                            <p>
                                <b>Danh mục:</b>{' '}
                                {randomFilm.categoryPublics.map((cate) => (
                                    <span style={{ color: 'blue' }}>#{cate.name}</span>
                                ))}
                            </p>
                            <span>
                                <b>Số tập: </b> {randomFilm.videoPublics.length + '/' + randomFilm.totalEpisode}{' '}
                                &emsp;&emsp; <b>Lượt xem: </b>
                                {randomFilm.totalViews}
                            </span>
                            <p>
                                <b>Đăng tải: </b>
                                {moment(randomFilm.publishedAt).fromNow()}
                            </p>
                            <Level level={randomFilm.level} />
                            <MDEditor.Markdown
                                style={{
                                    marginTop: '10px',
                                    whiteSpace: 'pre-wrap',
                                    backgroundColor: 'transparent',
                                    width: '100%',
                                    height: '50px',
                                    overflow: 'hidden'
                                }}
                                source={randomFilm ? randomFilm.description : ''}
                            />
                        </div>
                        <Link to={`/view-video/${randomFilm.id}/1`}>
                            <Thumbnail thumbnail={randomFilm ? randomFilm.thumbnail : ''} />
                        </Link>
                    </>
                ) : (
                    <></>
                )}
            </div>

            <CategoryList filmList={allFilms} filterFilmList={filterFilmList} />
            <div style={{ marginTop: '10px' }}>
                <span>Trình độ: </span>
                <select
                    style={{ width: '100px' }}
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                >
                    <option value={'N1'}>N1</option>
                    <option value={'N2'}>N2</option>
                    <option value={'N3'}>N3</option>
                    <option value={'N4'}>N4</option>
                    <option value={'N5'}>N5</option>
                </select>
            </div>
            <VideoList filmList={selectedLevel ? filmList.filter((film) => film.level === selectedLevel) : filmList} />
        </div>
    )
}
