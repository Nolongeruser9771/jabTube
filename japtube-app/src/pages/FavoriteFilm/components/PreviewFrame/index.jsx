import classNames from 'classnames/bind'
import styles from './PreviewFrame.module.scss'
import ReactPlayer from 'react-player'
import playBtn from '../../../../assets/images/play.png'
import playVideoDetailBtn from '../../../../assets/images/play-detail-video.png'
import { Link, useLocation } from 'react-router-dom'
import moment from 'moment'
import { useContext, useState, useEffect } from 'react'
import UserContext from '../../../../context/UserContext/UserContext'
const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function PreviewFrame({ title, total, unit, previewFilm, videoList, previewFavFilm, filmList }) {
    const location = useLocation().pathname
    const previewFilmObj = location.includes('favorite-film') ? previewFavFilm : previewFilm
    const { user } = useContext(UserContext)

    let lastUpdated = location.includes('favorite-film')
        ? filmList
            ? filmList.length > 0
                ? moment(filmList[0].likedAt).fromNow()
                : ''
            : ''
        : videoList
        ? videoList.length > 0
            ? moment(videoList[0].watchedAt).fromNow()
            : ''
        : ''

    let videoUrl = previewFilmObj
        ? API_URL + `/api/v1/videos/watch/video?videoId=${previewFilmObj.videoId}&userId=`
        : null

    //-------------------------user role check to enable play---------------------------------
    const [playerControl, setPlayerControl] = useState(false)

    useEffect(() => {
        if (previewFilmObj == null || previewFilmObj == undefined) {
            return
        }

        if (previewFilmObj.isFree) {
            setPlayerControl(true)
            return
        }
        if (user) {
            let roles = user.roles.map((role) => role.role)
            roles.includes('ADMIN') || roles.includes('USER_VIP') ? setPlayerControl(true) : setPlayerControl(false)
        } else {
            setPlayerControl(false)
        }
    }, [previewFilmObj])

    return (
        <div className={cx('preview-container')}>
            <div className={cx('preview-video')}>
                <div className={cx('overlay-play')}>
                    <img src={playBtn} alt="" className={cx('play-btn')} />
                </div>
                <div className={cx('thumbnail')}>
                    {videoUrl ? (
                        <ReactPlayer
                            controls={playerControl}
                            config={{
                                file: {
                                    attributes: {
                                        controlsList: 'nofullscreen nodownload',
                                        crossOrigin: 'true',
                                    },
                                },
                            }}
                            width="100%"
                            height="100%"
                            url={videoUrl}
                        ></ReactPlayer>
                    ) : (
                        <img
                            style={{ width: '100%', height: '100%', borderRadius: '15px' }}
                            src="https://petto.vn/wp-content/uploads/2019/12/4.jpg?v=1598606271"
                        />
                    )}
                </div>
            </div>
            <div className={cx('video-list-info')}>
                <h2>{title}</h2>
                <p>
                    {total} {unit}
                </p>
                <>
                    <p>Cập nhật lần cuối: {lastUpdated ? lastUpdated : ''}</p>
                    <p>Nhấn phần thông tin để xem trước phim</p>
                    <Link
                        to={previewFilmObj ? `/view-video/${previewFilmObj.filmId}/${previewFilmObj.ep}` : ''}
                        className={cx('view-video-btn')}
                    >
                        <img src={playVideoDetailBtn} alt="" />
                        Ấn vào đây để xem phim này với phụ đề
                    </Link>
                </>
            </div>
        </div>
    )
}
