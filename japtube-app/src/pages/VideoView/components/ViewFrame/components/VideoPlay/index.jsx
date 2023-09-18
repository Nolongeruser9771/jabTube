import classNames from 'classnames/bind'
import styles from './VideoPlay.module.scss'
import share from '../../../../../../assets/images/share.png'
import save from '../../../../../../assets/images/save.png'
import FilmPlayContext from '../../../../../../context/PlayFilmContext/FilmPlayContext'
import UserContext from '../../../../../../context/UserContext/UserContext'
import { useContext, useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getTimestamps } from '../../../../../../store/action'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment'
import authHeader from '../../../../../../service/authHeader'
import playBtn from '../../../../../../assets/images/play.png'
const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function VideoPlay({ subtitleDisplay, timeMarks }) {
    const { filmPlay, videoPlay, subtitlePlay, dispatchSubtitlePlay } = useContext(FilmPlayContext)
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const videoRef = useRef()

    //rewind render
    useEffect(() => {
        console.log('rewindTime')
        if (subtitlePlay !== undefined) {
            rewindToTime(subtitlePlay.rewind)
        }
    }, [subtitlePlay])

    //category render
    const categoryRender = (filmPlay) => {
        if (Object.keys(filmPlay).length !== 0) {
            return filmPlay.categoryPublics.map((cate, index) => (
                <a key={index} href="">
                    #{cate.name}
                </a>
            ))
        }
        return <>Loading...</>
    }

    //time to rewind and currrent time
    const rewindToTime = (timeInSeconds) => {
        if (videoRef.current) {
            // Seek to the specified time in seconds
            videoRef.current.currentTime = timeInSeconds
        }
    }

    // const updateTime = () => {
    //     if (timeMarks) {
    //         console.log(timeMarks)

    //         if (playerRef.current) {
    //             // Get the current playback time in seconds
    //             const currentTime = playerRef.current.currentTime
    //             updatedTimeMarks = timeMarks.map((timestamp) => ({
    //                 ...timestamp,
    //                 enable: currentTime >= timestamp.timestamp,
    //             }))
    //             dispatchSubtitlePlay(getTimestamps(updatedTimeMarks))
    //         }
    //     }

    //     useEffect(() => {
    //         //update lai subtitle time mark

    //         if (playerRef.current) {
    //             playerRef.current.addEventListner('updateTime', updateTime)
    //         }

    //         //clean
    //         return playerRef.current.removeEventListener('updateTime', updateTime)
    //     }, [timeMarks])
    // }

    //navigate to short making page

    const shortMakingHandle = () => {
        if (user) {
            const videoId = videoPlay.id
            navigate(`/short-making/${videoId}`)
        } else {
            toast.error('Bạn cần đăng nhập để thực hiện chức năng này', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            })
        }
    }

    //-----------------video url----------------------
    let videoUrl =
        Object.keys(videoPlay).length !== 0
            ? API_URL + `/api/v1/videos/watch/video?videoId=${videoPlay.id}&userId=${user ? user.id : ''}`
            : ''

    //get video & subtitle
    useEffect(() => {
        if (Object.keys(videoPlay).length !== 0) {
            getJapSub()
            getVietSub()
            setIsJapSubExist(videoPlay.isJapSubExist)
            setIsVietSubExist(videoPlay.isVietSubExist)
        }
    }, [videoPlay])

    //get jap sub blob
    const [jabSub, setJabSub] = useState()

    const getJapSub = async () => {
        try {
            const videoFetch = await fetch(API_URL + `/api/v1/subtitles/read?videoId=${videoPlay.id}&lang=jp`, {
                headers: authHeader(),
            })
            const res = await videoFetch.blob()
            setJabSub(URL.createObjectURL(res))
        } catch (error) {
            console.log(error)
        }
    }

    //get viet sub
    const [vietSub, setVietSub] = useState()

    const getVietSub = async () => {
        try {
            const videoFetch = await fetch(API_URL + `/api/v1/subtitles/read?videoId=${videoPlay.id}&lang=vi`, {
                headers: authHeader(),
            })
            const res = await videoFetch.blob()
            setVietSub(URL.createObjectURL(res))
        } catch (error) {
            console.log(error)
        }
    }

    //-------------------------user role check to enable play---------------------------------
    const [playerControl, setPlayerControl] = useState(false)
    const [isJapSubExist, setIsJapSubExist] = useState()
    const [isVietSubExist, setIsVietSubExist] = useState()

    useEffect(() => {
        if (Object.keys(videoPlay).length === 0) {
            return
        }

        if (videoPlay.isFree) {
            setPlayerControl(true)
            return
        }
        console.log(user)
        if (user) {
            let roles = user.roles.map((role) => role.role)
            roles.includes('ADMIN') || roles.includes('USER_VIP') ? setPlayerControl(true) : setPlayerControl(false)
        } else {
            setPlayerControl(false)
        }
    }, [videoPlay])

    const popupHandle = () => {
        console.log()
        if (playerControl) {
            return
        }
        toast.error('Đây là video vip, bạn cần kích hoạt gói ưu đãi để xem!', {
            autoClose: 1000,
        })
    }

    return (
        <div className={cx('play-video')}>
            <div className={cx('preview-video')} onClick={() => popupHandle()}>
                <div className={cx('overlay-play')}>
                    <img src={playBtn} alt="" className={cx('play-btn')} />
                </div>
                <div className={cx('thumbnail')}>
                    {playerControl ? (
                        <>
                            <video src={videoUrl} ref={videoRef} controls controlsList="nodownload">
                                {isJapSubExist ? (
                                    <track src={jabSub} kind="subtitles" srcLang="jp" label="Japanese"></track>
                                ) : (
                                    <></>
                                )}
                                {isVietSubExist ? (
                                    <track src={vietSub} kind="subtitles" srcLang="vi" label="Vietnamese"></track>
                                ) : (
                                    <></>
                                )}
                            </video>
                        </>
                    ) : (
                        <>
                            <video src={videoUrl} pause></video>
                        </>
                    )}
                </div>
            </div>

            <div className={cx('tags')}>{categoryRender(filmPlay)}</div>

            <h3>{videoPlay ? videoPlay.tittle : ''}</h3>
            <div className={cx('play-video-info')}>
                <p>
                    {videoPlay ? videoPlay.views : ''} Views &bull;{' '}
                    {videoPlay ? moment(videoPlay.publishedAt).fromNow() : ''}
                </p>
                <div>
                    <a onClick={shortMakingHandle}>
                        <img src={share} alt="" />
                        Tạo shorts
                    </a>
                    <Link to={'/playlist'}>
                        <img src={save} alt="" />
                        Trở về playlist
                    </Link>
                    <span onClick={subtitleDisplay}>
                        <img src={share} alt="" />
                        Bật/Tắt bản ghi phụ đề
                    </span>
                </div>
            </div>
        </div>
    )
}
