import classNames from 'classnames/bind'
import styles from './RightSideBar.module.scss'
import FilmContext from '../../../../context/PlayFilmContext/FilmPlayContext'
import { useContext, useEffect, useState } from 'react'
import Thumbnail from '../../../Home/components/VideoList/components/Thumbnail/Thumbnail'
import Level from '../../../Home/components/VideoList/components/Level/Level'
import play from '../../../../assets/images/play.png'
import moment from 'moment'
import { Link } from 'react-router-dom'
const API_URL = 'http://localhost:8080'
import LazyLoad from 'react-lazyload'

const cx = classNames.bind(styles)

function RightSideBar() {
    const { filmPlay } = useContext(FilmContext)
    const [relatedFilms, setRelatedFilms] = useState()

    //get film by categoryIds
    useEffect(() => {
        //lấy danh sách category
        if (filmPlay.categoryPublics !== undefined) {
            let categoryIds = []
            const categories = filmPlay.categoryPublics

            categories.forEach((cate) => {
                categoryIds.push(cate.id)
            })
            console.log(categoryIds)
            getFilmsInCategoryIds(categoryIds)
        }
    }, [filmPlay])

    //call pai to get relatedList
    const getFilmsInCategoryIds = async (ids) => {
        try {
            const categoryIds = {
                categoryIds: ids,
            }

            if (categoryIds.length !== 0) {
                const filmFetch = await fetch(API_URL + `/api/v1/films/categoryIds?filmId=${filmPlay.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify(categoryIds),
                })
                const res = await filmFetch.json()
                if (!res.message) {
                    setRelatedFilms(res)
                    console.log('related films')
                    console.log(res)
                    setRelatedFilms(res)
                }
                console.log(res)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={cx('right-sidebar')}>
            {relatedFilms ? (
                relatedFilms.map((film) => (
                    <LazyLoad offset={100} scroll={true} key={film.id}>
                        <Link
                            to={`/view-video/${film.id}/1`}
                            key={film.id}
                            id={'film-' + film.id}
                            className={cx('vid-list')}
                        >
                            <div className={cx('thumbnail-container')}>
                                <div className={cx('overlay-play')}>
                                    <img src={play} alt="" className={cx('play-btn')} />
                                </div>
                                <div className={cx('thumbnail')}>
                                    <Thumbnail thumbnail={film.thumbnail} />
                                </div>
                            </div>

                            <div className={cx('flex-div')}>
                                <div className={cx('vid-info')}>
                                    <p id={cx('title')}>{film.title}</p>
                                    <p>
                                        {film.totalViews} Views &bull; {moment(film.publishedAt).fromNow()}
                                    </p>
                                </div>
                                <Level level={film.level} />
                            </div>
                        </Link>
                    </LazyLoad>
                ))
            ) : (
                <></>
            )}
        </div>
    )
}

export default RightSideBar
