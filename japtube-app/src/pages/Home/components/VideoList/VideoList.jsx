import classNames from 'classnames/bind'
import styles from './VideoList.module.scss'
import Thumbnail from './components/Thumbnail/Thumbnail'
import Level from './components/Level/Level'
import play from '../../../../assets/images/play.png'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import moment from 'moment'
const API_URL = 'http://localhost:8080'
import LazyLoad from 'react-lazyload'

const cx = classNames.bind(styles)

export default function VideoList({ filmList }) {
    useEffect(() => {
        if (filmList.message) {
            return
        }
    }, [])

    return (
        <div className={cx('list-container')}>
            {filmList.map((film) => (
                <Link to={`/view-video/${film.id}/1`} key={film.id} id={'film-' + film.id} className={cx('vid-list')}>
                    <LazyLoad height={200} offset={100} scroll={true}>
                        <div className={cx('overlay-play')}>
                            <img src={play} alt="" className={cx('play-btn')} />
                        </div>

                        <Thumbnail thumbnail={film.thumbnail} />

                        <div className={cx('flex-div')}>
                            <>
                                <Level level={film.level} />

                                <div className={cx('vid-info')}>
                                    <p id={cx('title')}>{film.title}</p>
                                    <p>
                                        {film.totalViews} Views &bull; {moment(film.publishedAt).fromNow()}
                                    </p>
                                </div>
                            </>
                        </div>
                    </LazyLoad>
                </Link>
            ))}
        </div>
    )
}
