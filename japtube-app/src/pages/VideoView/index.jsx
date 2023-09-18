import classNames from 'classnames/bind'
import styles from './Videoview.module.scss'
import RightSideBar from './components/VideoList'
import ViewFrame from './components/ViewFrame'
import SubtitleGenerator from './components/SubtitleGenerator'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { changeFilm, changeVideo, rewind } from '../../store/action'
import FilmPlayContext from '../../context/PlayFilmContext/FilmPlayContext'
import { useContext } from 'react'

const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

function VideoView() {
    const { filmPlay, videoPlay, dispatchFilmPlay, dispatchVideoPlay, subtitlePlay, dispatchSubtitlePlay } =
        useContext(FilmPlayContext)
    const { filmId, ep } = useParams()

    useEffect(() => {
        getVideo()
        getFilm()
    }, [ep, filmId])

    //lấy thông tin video và film
    const getFilm = async () => {
        const filmFetch = await fetch(API_URL + '/api/v1/films/' + filmId)
        const res = await filmFetch.json()
        if (!res.message) {
            console.log(res)
            //set lại thông tin film đang chiếu
            dispatchFilmPlay(changeFilm(res))
        } else {
            dispatchFilmPlay(changeFilm(null))
        }
    }

    const getVideo = async () => {
        const videoFetch = await fetch(API_URL + `/api/v1/videos/get-video?filmId=${filmId}&ep=${ep}`)
        const res = await videoFetch.json()
        if (!res.message) {
            console.log(res)
            //set lại thông tin video đang chiếu
            dispatchVideoPlay(changeVideo(res))
        } else {
            dispatchVideoPlay(changeVideo(null))
        }
    }

    // //xử lí rewind
    const rewindToTime = (time) => {
        //định dạng {hh,mm, ss}
        if (time) {
            dispatchSubtitlePlay(rewind(+time))
            console.log('subtitle test')
            console.log(subtitlePlay)
        }
    }
    //display subtitle
    const [subtitleDisplay, setSubtitleDisplay] = useState()

    const subtitleDisplayHandle = () => {
        setSubtitleDisplay(!subtitleDisplay)
    }

    //--------------------------------text sub generate----------------------------
    const [timeMarks, setTimeMarks] = useState()
    useEffect(() => {
        getJapSubText()
    }, [videoPlay])

    //get japsub text
    const getJapSubText = async () => {
        if (videoPlay.id !== undefined) {
            try {
                const videoFetch = await fetch(API_URL + `/api/v1/subtitles/read?videoId=${videoPlay.id}&lang=jp`)
                const res = await videoFetch.text()
                console.log('json japsub')

                parseVTT(res)
                console.log('loading subtitle...')
            } catch (error) {
                console.log(error)
            }
        }
    }

    const getTimeInSecond = (time) => {
        try {
            if (time.length >= 12) {
                let timeDistract = time.split(':')
                let hour = timeDistract[0]
                let minute = timeDistract[1]
                let second = timeDistract[2].substr(0, 2)
                return Number(hour) * 60 * 60 + Number(minute) * 60 + Number(second)
            }

            if ((time.length >= 9) & (time.length < 12)) {
                let timeDistract = time.split(':')
                let minute = timeDistract[0]
                let second = timeDistract[1].split('.')[0]
                return Number(minute) * 60 + Number(second)
            }
            if ((time.length >= 6) & (time.length < 9)) {
                let second = time.slpit('.')[0]
                return Number(minute) * 60 + Number(second)
            }
        } catch (error) {
            error
        }
    }

    const [subtitles, setSubtitles] = useState([])

    const parseVTT = (content) => {
        const lines = content.split('\n')
        const subtitleEntries = []
        let entry = {}
        const subtitleTimeMarks = []

        for (const line of lines) {
            if (line.trim() === '') {
                if (entry.start && entry.text) {
                    subtitleEntries.push(entry)
                }
                entry = {}
            } else if (!entry.start) {
                const [start, end] = line.split(' ')
                entry.start = getTimeInSecond(start)
                entry.end = end

                //add to timeMarks list
                subtitleTimeMarks.push({
                    timestamp: entry.start,
                    enable: false,
                })
            } else if (!entry.text) {
                entry.text = line
            }
        }
        setSubtitles(subtitleEntries)
        setTimeMarks(timeMarks)
    }

    return (
        <div className={cx('play-container')}>
            <div className={cx('row')}>
                <ViewFrame subtitleDisplay={subtitleDisplayHandle} timeMarks={timeMarks}/>
                <div className={cx('video-right-side')}>
                    {/* subtitle */}
                    {subtitleDisplay ? (
                        <SubtitleGenerator
                            rewindToTime={rewindToTime}
                            subtitleDisplay={subtitleDisplayHandle}
                            subtitles={subtitles}
                        />
                    ) : (
                        <></>
                    )}

                    {/* sidebar */}
                    <RightSideBar />
                </div>
            </div>
        </div>
    )
}

export default VideoView
