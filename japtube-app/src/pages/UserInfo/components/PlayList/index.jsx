import classNames from 'classnames/bind'
import styles from './PlayList.module.scss'
import play from '../../../../assets/images/play.png'
import Thumbnail from '../../../Home/components/VideoList/components/Thumbnail/Thumbnail'
import { Link } from 'react-router-dom'
import UserContext from '../../../../context/UserContext/UserContext'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { BsFillPencilFill } from 'react-icons/bs'
import { BsTrash3 } from 'react-icons/bs'
import { BsXLg } from 'react-icons/bs'
import { ToastContainer, toast } from 'react-toastify'
import playlistThumbnail from '../../../../assets/images/playlist-thumbnail.png'
import 'react-toastify/dist/ReactToastify.css'

const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function PlayList() {
    const { user } = useContext(UserContext)

    //------------------------------Get Playlist----------------------------------------------
    const [playLists, setPlaylists] = useState()

    useEffect(() => {
        getPlaylist()
        getAllShorts()
    }, [])

    const getPlaylist = async () => {
        if (user) {
            const shortFetch = await fetch(API_URL + `/api/v1/playlists?userId=${user.id}`)
            const res = await shortFetch.json()

            if (!res.message) {
                setPlaylists(res)
                console.log(res)
            }
        }
    }

    //------------------------------Modal to CRUD Playlist---------------------------------------
    const [modalDisplay, setModalDisplay] = useState(false)
    const [editModalDisplay, setEditModalDisplay] = useState()
    const [deleteModalDisplay, setDeletetModalDisplay] = useState()
    const [deletePlaylistId, setDeletePlaylistId] = useState()
    const [editPlaylistId, setEditPlaylistId] = useState()
    const [chosenPlaylistId, setChosenPlaylistId] = useState()

    const modifyPlaylistHandle = (playlistId) => {
        setChosenPlaylistId(playlistId)
        setModalDisplay(!modalDisplay)
        setEditModalDisplay(false)
        setDeletePlaylistId(false)
    }

    const editModalDisplayHandle = (playlistId) => {
        setModalDisplay(false)
        setEditModalDisplay(true)
        setEditPlaylistId(playlistId)
    }

    const deleteModalDisplayHandle = (playlistId) => {
        setModalDisplay(false)
        setDeletetModalDisplay(true)
        setDeletePlaylistId(playlistId)
    }

    //edit playlist
    const [editPlaylistValue, setEditPlaylistValue] = useState()
    //input change
    const handleInputChange = (e) => {
        if (e) {
            setEditPlaylistValue(e.target.value)
        }
    }

    //update confirm
    const handleUpdatePlaylistConfirm = async (e) => {
        if (e.keyCode === 13) {
            try {
                const playlistFetch = await fetch(API_URL + `/api/v1/playlists`, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify({
                        playlistId: editPlaylistId,
                        name: editPlaylistValue,
                    }),
                })
                const res = await playlistFetch.json()
                if (!res.message) {
                    setPlaylists(
                        playLists.map((playlist) => {
                            if (playlist.id === editPlaylistId) {
                                return { ...playlist, name: editPlaylistValue }
                            }
                            return playlist
                        })
                    )
                    setEditPlaylistValue('')
                    setEditPlaylistId(null)
                    toast.success('Chỉnh sửa tiêu đề thành công!', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 500,
                    })
                }
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        }
    }

    //delete
    //confirm delete
    const confirmDeletePlaylistHandle = async () => {
        try {
            const playlistFetch = await fetch(API_URL + `/api/v1/playlists?playlistId=${deletePlaylistId}`, {
                method: 'DELETE',
            })
            const res = await playlistFetch.json()
            if (res.status === 'OK') {
                setPlaylists(playLists.filter((playlist) => playlist.id != deletePlaylistId))
                toast.success('Xóa playlist thành công!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                })
            } else {
                toast.error('Xóa playlist thất bại!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                })
            }
            setDeletePlaylistId(null)
            setDeletetModalDisplay(!deleteModalDisplay)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    //------------------------------------play all--------------------------------------------
    //get all shorts
    const [totalShorts, setTotalShorts] = useState()
    const getAllShorts = async () => {
        const shortsFetch = await fetch(API_URL + `/api/v1/shorts?userId=${user.id}`)
        const res = await shortsFetch.json()

        if (!res.message) {
            setTotalShorts(res.length)
        }
    }

    return (
        <div className={cx('playlist-container')}>
            <div className={cx('playlist-item')}>
                <Link to={`/playlist/all`} className={cx('thumbnail-container')}>
                    <div className={cx('overlay-play')}>
                        <img src={play} alt="" className={cx('play-btn')} />
                    </div>
                    <div className={cx('thumbnail')}>
                        <img style={{ width: '100%', height: '100%', borderRadius: '10px' }} src={playlistThumbnail} />
                    </div>
                </Link>

                <div className={cx('play-btn')}>
                    <p>Danh sách tổng hợp</p>
                    <div>
                        <span>{totalShorts} shorts</span>
                        <BsThreeDots className={cx('modify-btn')} />
                    </div>
                </div>
            </div>

            {playLists ? (
                playLists.map((playlist) => (
                    <div className={cx('playlist-item')} key={playlist.id}>
                        {/* pop up */}
                        {modalDisplay & (chosenPlaylistId === playlist.id) ? (
                            <div className={cx('playlist-modal-popup')}>
                                <div onClick={() => editModalDisplayHandle(playlist.id)}>
                                    <BsFillPencilFill /> Sửa tiêu đề
                                </div>
                                <div onClick={() => deleteModalDisplayHandle(playlist.id)}>
                                    <BsTrash3 /> Xóa playlist
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}

                        {/* edit pops up */}
                        {editModalDisplay & (editPlaylistId === playlist.id) ? (
                            <div className={cx('edit-modal-popup')}>
                                <div
                                    className={cx('modal-popup-close')}
                                    onClick={() => setEditModalDisplay(!editModalDisplay)}
                                >
                                    <BsXLg />
                                </div>

                                <input
                                    type="text"
                                    placeholder="Enter your new title..."
                                    value={editPlaylistValue ? editPlaylistValue : ''}
                                    onKeyDown={(e) => handleUpdatePlaylistConfirm(e)}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                        ) : (
                            <></>
                        )}

                        {deleteModalDisplay & (deletePlaylistId === playlist.id) ? (
                            <div className={cx('delete-modal-popup')}>
                                <div
                                    className={cx('modal-popup-close')}
                                    onClick={() => setDeletetModalDisplay(!deleteModalDisplay)}
                                >
                                    <BsXLg />
                                </div>
                                <div>Bạn chắc chắn muốn xóa playlist này?</div>
                                <div>
                                    <span onClick={() => setDeletetModalDisplay(!deleteModalDisplay)}>Hủy</span>
                                    <span onClick={confirmDeletePlaylistHandle}>Đồng ý</span>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}

                        <Link to={`/playlist/${playlist.id}`} className={cx('thumbnail-container')}>
                            <div className={cx('overlay-play')}>
                                <img src={play} alt="" className={cx('play-btn')} />
                            </div>
                            <div className={cx('thumbnail')}>
                                <img
                                    style={{ width: '100%', height: '100%', borderRadius: '10px' }}
                                    src={playlistThumbnail}
                                />
                            </div>
                        </Link>

                        <div className={cx('play-btn')}>
                            <p>{playlist.name}</p>
                            <div>
                                <span>{playlist.shorts.length} shorts</span>
                                <BsThreeDots
                                    className={cx('modify-btn')}
                                    onClick={() => modifyPlaylistHandle(playlist.id)}
                                />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <></>
            )}
            <ToastContainer />
        </div>
    )
}
