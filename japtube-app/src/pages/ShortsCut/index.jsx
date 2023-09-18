import classNames from 'classnames/bind'
import styles from './ShortsCut.module.scss'
import { useState, useEffect, useContext, useRef } from 'react'
import UserContext from '../../context/UserContext/UserContext'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FilmPlayContext from '../../context/PlayFilmContext/FilmPlayContext'
import { Box, Slider } from '@mui/material'
import { Duration } from 'luxon'
import authHeader from '../../service/authHeader'
import secureLocalStorage from 'react-secure-storage'

const cx = classNames.bind(styles)
const API_URL = 'http://localhost:8080'

export default function ShortsCut() {
    const { user } = useContext(UserContext)
    const { videoPlay } = useContext(FilmPlayContext)
    const { videoId } = useParams()
    const [message, setMessage] = useState()
    const navigate = useNavigate()

    //shorts making
    //Khai báo validation cho từng trường
    const schema = yup
        .object({
            title: yup.string().required('Tiêu đề không được bỏ trống'),
            startTime: yup.string().required('Thời gian bắt đầu không được bỏ trống'),
            length: yup.string().required('Độ dài không được bỏ trống, không được quá 3 mins'),
        })
        .required()
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        //set default value
        defaultValues: {
            videoId: videoId,
            userId: user.id,
        },
        //truyền schema vào
        resolver: yupResolver(schema),
        mode: 'all',
    })

    const onSubmit = async (data) => {
        console.log(data)
        if (formatTimeStringToSecond(data.length) > formatTimeStringToSecond(videoPlay.duration)) {
            toast.error('Thời gian kết thúc shorts lớn hơn độ dài video, không phù hợp!', {
                autoClose: 1000,
            })
            return
        }

        if (formatTimeStringToSecond(data.length) > 180) {
            toast.error('Độ dài shorts tối đa là 3 mins!', {
                autoClose: 1000,
            })
            return
        }
        let request = {
            title: data.title,
            description: data.description,
            videoId: videoId,
            userId: user.id,
            startTime: formatTimeStringToSecond(data.startTime),
            length: formatTimeStringToSecond(data.length),
        }

        const auth = secureLocalStorage.getItem('thisAuth')

        try {
            const result = await fetch(API_URL + `/api/v1/shorts/create`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + auth.jwtToken,
                    'Content-type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(request),
            })
            const res = await result.json()
            if (!res.message) {
                setMessage('Successfully created!')

                //notify
                toast.success('Tạo shorts thành công!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                })
                // navigate to short view frame
                setTimeout(() => {
                    navigate(`/shorts/${res.id}`)
                }, 2000)
            } else {
                setMessage(res.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Chức năng này chỉ dành cho user vip!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            })
        }
    }

    //video play
    const [videoUrl, setVideoUrl] = useState()
    useEffect(() => {
        Object.keys(videoPlay).length !== 0
            ? setVideoUrl(API_URL + `/api/v1/videos/watch/video?videoId=${videoId}&userId=${user ? user.id : ''}`)
            : ''
    }, [videoPlay])

    //------------------slider - time picker---------------------------
    const [timeValue, setTimeValue] = useState([0, 180])

    const handleChange = (newValue) => {
        if (newValue[1] !== timeValue[1]) {
            rewindToTime(newValue[1])
        }

        if (newValue[0] !== timeValue[0]) {
            rewindToTime(newValue[0])
        }
        setTimeValue(newValue)
    }

    //format second to hh:mm:ss
    const formatSecondToTimeString = (timeValue) => {
        const durationValue = Duration.fromObject({ second: timeValue })
        return durationValue.toFormat('hh:mm:ss')
    }

    //format time hh:mm:ss to second
    function formatTimeStringToSecond(timeString) {
        if (timeString === '' || timeString === null) {
            return
        }
        console.log(timeString)
        let timeDistract = timeString.split(':')
        let hour = timeDistract[0]
        let minute = timeDistract[1]
        let second = timeDistract[2]
        return Number(hour) * 60 * 60 + Number(minute) * 60 + Number(second)
    }

    //get current playtime
    const playerRef = useRef(null)

    const rewindToTime = (timeInSeconds) => {
        if (playerRef.current) {
            // Seek to the specified time in seconds
            playerRef.current.seekTo(timeInSeconds, 'seconds')
        }
    }

    useEffect(() => {
        setValue('startTime', formatSecondToTimeString(timeValue[0]))
        setValue('endtime', formatSecondToTimeString(timeValue[1]))
        setValue('length', formatSecondToTimeString(timeValue[1] - timeValue[0]))
    }, [timeValue])

    return (
        <div className={cx('wrapper')}>
            {/* short */}
            <div className={cx('short-making-frame-wrapper')}>
                <div className={cx('video-preview-frame')}>
                    <ReactPlayer
                        controls={true}
                        ref={playerRef}
                        width="100%"
                        height="100%"
                        url={videoUrl}
                        config={{
                            file: {
                                attributes: {
                                    controlsList: 'nodownload', // Disable download button
                                },
                            },
                        }}
                    />
                    <Box sx={{ width: '100%' }}>
                        <Slider
                            value={timeValue}
                            onChange={(e) => handleChange(e.target.value)}
                            valueLabelDisplay="on"
                            valueLabelFormat={formatSecondToTimeString}
                            max={
                                Object.keys(videoPlay).length !== 0 ? formatTimeStringToSecond(videoPlay.duration) : 100
                            }
                        />
                    </Box>
                </div>
                <div className={cx('shorts-input-info')}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="">Tiêu đề Shorts: </label>
                            <input
                                type="text"
                                className={cx('short-input')}
                                id={cx('title')}
                                placeholder="input shorts title..."
                                {...register('title')}
                            />
                            <p className={cx('text-danger')}>{errors.title?.message}</p>
                        </div>
                        <div>
                            <label htmlFor="">Mô tả Shorts: </label>
                            <input
                                type="text"
                                className={cx('short-input')}
                                id={cx('description')}
                                placeholder="input shorts description..."
                                {...register('description')}
                            />
                            <p className={cx('text-danger')}>{errors.description?.message}</p>
                        </div>
                        <div>
                            <label htmlFor="">
                                Thời gian bắt đầu: <i>(HH:mm:ss)</i>
                            </label>
                            <input
                                type="text"
                                className={cx('short-input')}
                                id={cx('startTime')}
                                placeholder="input shorts title..."
                                {...register('startTime')}
                            />
                            <p className={cx('text-danger')}>{errors.startTime?.message}</p>
                        </div>
                        <div>
                            <label htmlFor="">
                                Thời gian kết thúc: <i>(HH:mm:ss)</i>
                            </label>
                            <input
                                type="text"
                                className={cx('short-input')}
                                id={cx('endtime')}
                                placeholder="input shorts title..."
                                {...register('endtime')}
                            />
                            <p className={cx('text-danger')}>{errors.endtime?.message}</p>
                        </div>
                        <div>
                            <label htmlFor="">
                                Độ dài shorts: <i>(HH:mm:ss)</i>
                            </label>
                            <input
                                type="text"
                                className={cx('short-input')}
                                id={cx('length')}
                                placeholder="input shorts title..."
                                {...register('length')}
                            />
                            <p className={cx('text-danger')}>{errors.length?.message}</p>
                        </div>
                        <div className={cx('text-danger')}>{message ? message : ''}</div>
                        <div className={cx('shorts-create-form-btn')}>
                            {/* go back */}
                            <div onClick={() => navigate(-1)}>Hủy</div>
                            <button type="submit">Hoàn tất</button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
