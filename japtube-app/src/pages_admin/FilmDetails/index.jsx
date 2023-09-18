import { useMemo, useState, useEffect, useContext } from 'react'
import Table from './components/Table'
import classNames from 'classnames/bind'
import { DateTime } from 'luxon'
import styles from './FilmDetails.module.scss'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useParams } from 'react-router-dom'
import ThumbnailEl from './components/ThumbnailEl'
import FilmEditor from '../FilmEditor'
import FilmPlayContext from '../../context/PlayFilmContext/FilmPlayContext'
import { changeFilm } from '../../store/action'
import authHeader from '../../service/authHeader'
const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

function FilmDetails() {
    const [videoData, setVideoData] = useState([])
    const [filmData, setFilmData] = useState([])
    const { dispatchFilmPlay } = useContext(FilmPlayContext)
    const { filmId } = useParams()

    useEffect(() => {
        if (filmId) {
            try {
                ;(async () => {
                    const result = await fetch(API_URL + `/api/v1/admin/films/${filmId}`, {
                        headers: authHeader()
                    })
                    const res = await result.json()
                    if (!res.message) {
                        setVideoData(res.videoPublics)
                        setFilmData(res)
                        dispatchFilmPlay(changeFilm(res))
                    }
                    console.log(res.message)
                })()
            } catch (error) {
                console.log(error)
            }
        }
    }, [filmId])

    const columns = useMemo(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
            },
            {
                header: 'Video',
                cell: ({ row }) => <ThumbnailEl row={row} />,
            },
            {
                header: 'Title',
                accessorKey: 'tittle',
            },
            {
                header: 'Episode',
                accessorKey: 'episode',
            },
            {
                header: 'Free',
                accessorKey: 'isFree',
                cell: (info) =>
                    info.getValue() === true ? (
                        <span
                            style={{
                                backgroundColor: 'rgba(60, 179, 113, 0.75)',
                                padding: '5px 10px',
                                marginRight: '3px',
                                borderRadius: '10px',
                            }}
                        >
                            Free
                        </span>
                    ) : (
                        <span
                            style={{
                                backgroundColor: 'rgb(241, 148, 138)',
                                padding: '5px 10px',
                                marginRight: '3px',
                                borderRadius: '10px',
                            }}
                        >
                            Pro
                        </span>
                    ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (info) =>
                    info.getValue() ? (
                        <span style={{ color: 'rgb(40, 116, 166)' }}>Công khai</span>
                    ) : (
                        <span style={{ color: 'rgb(205, 97, 85)' }}>Riêng tư</span>
                    ),
            },
            {
                header: 'Create At',
                accessorKey: 'createdAt',
                cell: (info) => DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED),
            },
            {
                header: 'Update At',
                accessorKey: 'updatedAt',
                cell: (info) => DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED),
            },
            {
                header: 'Published At',
                accessorKey: 'publishedAt',
                cell: (info) =>
                    info.getValue() ? DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED) : '',
            },
            {
                header: 'Lượt xem',
                accessorKey: 'views',
            },
        ],
        []
    )

    const updateData = (updatedData) => {
        setVideoData(updatedData)
    }

    return (
        <>
            <div className={cx('film-editor-wrapper')}></div>
            <FilmEditor filmData={filmData} />
            <Table columns={columns} data={videoData} updateData={updateData}></Table>
            <ToastContainer />
        </>
    )
}

export default FilmDetails
