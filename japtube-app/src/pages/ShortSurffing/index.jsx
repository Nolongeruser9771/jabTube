import classNames from 'classnames/bind'
import styles from './ShortsSuffing.module.scss'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Shorts from './components/Shorts'
import UserContext from '../../context/UserContext/UserContext'
import { useContext } from 'react'
const API_URL = 'http://localhost:8080'
import { Modal, Box, Button } from '@mui/material'
import { toast } from 'react-toastify'
import InfiniteScroll from 'react-infinite-scroll-component'

const cx = classNames.bind(styles)

export default function ShortSurffing() {
    const { user } = useContext(UserContext)
    const { shortsId } = useParams()
    const { playlistId } = useParams()
    const navigate = useNavigate()
    //get playlist
    const [playList, setPlaylist] = useState()

    useEffect(() => {
        getPlaylist()
    }, [])

    const getPlaylist = async () => {
        if (playlistId === 'all') {
            getAllShorts()
        } else if (playlistId) {
            const playlistFetch = await fetch(API_URL + `/api/v1/playlists/search?playlistId=${playlistId}`)
            const res = await playlistFetch.json()

            if (!res.message) {
                setPlaylist(res)
                console.log(res)
            }
        }
    }

    //------------------------------------------short delete------------------------------------------
    //Modal
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 5,
        pt: 2,
        px: 4,
        pb: 3,
    }

    const [deleteShortsId, setDeleteShortsId] = useState()
    const [open, setOpen] = useState(false)
    const handleOpen = (shortsId) => {
        setOpen(true)
        setDeleteShortsId(shortsId)
        console.log(shortsId)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const shortDeleteHandle = async () => {
        if (deleteShortsId !== null) {
            try {
                const deleteShorts = await fetch(API_URL + `/api/v1/shorts?shortsId=${deleteShortsId}`, {
                    method: 'DELETE',
                })
                const res = await deleteShorts.json()
                console.log(res)
                if (res.status === 'OK') {
                    toast.success('Xóa Shorts thành công!', {
                        autoClose: 500,
                    })

                    if (playlistId) {
                        if (playlistId === 'all') {
                            let newShortList = playList.filter((shorts) => shorts.id !== deleteShortsId)
                            setPlaylist(newShortList)
                        } else {
                            let newShortList = playList.shorts.filter((shorts) => shorts.id !== deleteShortsId)
                            setPlaylist({ ...playList, shorts: newShortList })
                        }
                    }
                    if (shortsId) {
                        setTimeout(() => {
                            navigate(-1)
                        }, 2000)
                    }

                    setDeleteShortsId(null)
                    handleClose()
                } else {
                    toast.error('Xóa Shorts thất bại!', {
                        autoClose: 1000,
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    //------------------------------------play all--------------------------------------------
    //get all shorts
    const getAllShorts = async () => {
        const shortsFetch = await fetch(API_URL + `/api/v1/shorts?userId=${user.id}`)
        const res = await shortsFetch.json()

        if (!res.message) {
            setPlaylist(res)
        }
    }

    return (
        <div className="app-wrapper">
            {/* Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h3 id="parent-modal-title">Xác nhận xóa shorts</h3>
                    <p id="parent-modal-description">Bạn chắc chắn muốn xóa shorts này?</p>
                    <div style={{ display: 'flex', justifyContent: 'right' }}>
                        <Button style={{ fontSize: '1.6rem' }} onClick={handleClose}>
                            Hủy
                        </Button>
                        <Button style={{ fontSize: '1.6rem' }} onClick={() => shortDeleteHandle()}>
                            Xóa
                        </Button>
                    </div>
                </Box>
            </Modal>

            {shortsId ? <Shorts shortsId={shortsId} userId={user.id} handleOpen={handleOpen} /> : <></>}

            {playList ? (
                playlistId === 'all' ? (
                    playList.map((short) => (
                        <Shorts
                            key={short.id}
                            shortsId={short.id}
                            userId={user ? user.id : null}
                            handleOpen={handleOpen}
                        />
                    ))
                ) : (
                    playList.shorts.map((short) => (
                        <Shorts
                            key={short.id}
                            shortsId={short.id}
                            userId={user ? user.id : null}
                            handleOpen={handleOpen}
                        />
                    ))
                )
            ) : (
                <></>
            )}
        </div>
    )
}
