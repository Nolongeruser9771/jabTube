import classNames from 'classnames/bind'
import styles from './PlaylistChoose.module.scss'
import { Checkbox } from '@material-ui/core'
import { AiOutlineClose } from 'react-icons/ai'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import { AiOutlineMinusSquare } from 'react-icons/ai'
import { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import UserContext from '../../../../context/UserContext/UserContext'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const cx = classNames.bind(styles)
const API_URL = 'http://localhost:8080'

export default function PlaylistChoose({ display, playlistIds, shortsId, playlistChangeHandle }) {
    const { user } = useContext(UserContext)
    const [playlists, setPlaylists] = useState([])
    const [createPlaylistDisplay, setCreatePlaylistDisplay] = useState(false)

    // render playlist
    useEffect(() => {
        const getPlaylist = async () => {
            const playlistFetch = await fetch(API_URL + `/api/v1/playlists?userId=${user.id}`)
            const res = await playlistFetch.json()
            if (!res.message) {
                setPlaylists(res)
                console.log(res)
            }
        }
        getPlaylist()
    }, [])

    //create playlist
    const [playlistName, setPlaylistName] = useState('')
    const onChangeHandle = (event) => {
        if (event) {
            setPlaylistName(event.target.value)
        }
    }

    const { auth } = useContext(UserContext)

    const createPlaylistHandle = (event) => {
        if ((event.keyCode === 13) & (event.target.value !== '')) {
            const playlistName = event.target.value

            const request = {
                name: playlistName,
                userId: user.id,
            }
            const createPlaylistRequest = async () => {
                const requestFetch = await fetch(API_URL + '/api/v1/playlists/create', {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + auth.jwtToken,
                        'Content-type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify(request),
                })

                const res = await requestFetch.json()
                console.log(res)

                setPlaylists([res, ...playlists])
                setPlaylistName('')
            }
            createPlaylistRequest()
        }
    }

    //check playlist
    const [chosenPlaylistIds, setChosenPlaylistIds] = useState(playlistIds)

    const onCheckboxChangeHandle = (event, playlistId) => {
        const isChecked = event.target.checked
        if (isChecked) {
            setChosenPlaylistIds([...chosenPlaylistIds, playlistId])
            console.log('+', playlistId)
        } else {
            setChosenPlaylistIds(chosenPlaylistIds.filter((id) => id !== playlistId))
            console.log('-', playlistId)
        }
    }

    //choose playlist confirm => update playlist of shorts
    const playlistChooseConfirmHandle = () => {
        const request = {
            shortsId: shortsId,
            playlistIds: chosenPlaylistIds,
        }
        const updateShorts = async () => {
            try {
                const shortsFetch = await fetch(API_URL + `/api/v1/shorts`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify(request),
                })
                const res = await shortsFetch.json()
                console.log(res)
                //show notification
                toast.success('Đã lưu thay đổi', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                })

                //update playlist
                playlistChangeHandle(chosenPlaylistIds)
            } catch (error) {
                console.log(error)
            }
        }
        updateShorts()
    }

    return (
        <>
            <div className={cx('playlist')}>
                {/* render playlist */}
                <div className={cx('playlist-menu-title')}>
                    <span>Lưu shorts vào...</span>
                    <label htmlFor={cx('playlist-display')}>
                        <AiOutlineClose id={cx('btn-close-playlist')} onClick={display} />
                    </label>
                </div>
                <div>
                    {playlists ? (
                        playlists.map((playlist) => (
                            <div key={playlist.id}>
                                <Checkbox
                                    id={cx(playlist.id)}
                                    checked={chosenPlaylistIds.includes(playlist.id)}
                                    onClick={(e) => onCheckboxChangeHandle(e, playlist.id)}
                                />
                                <span>{playlist.name}</span>
                            </div>
                        ))
                    ) : (
                        <></>
                    )}
                </div>

                <div className={cx('add-playlist')}>
                    {createPlaylistDisplay ? (
                        <AiOutlineMinusSquare
                            onClick={() => setCreatePlaylistDisplay(!createPlaylistDisplay)}
                            id={cx('btn-add-playlist')}
                        />
                    ) : (
                        <AiOutlinePlusSquare
                            onClick={() => setCreatePlaylistDisplay(!createPlaylistDisplay)}
                            id={cx('btn-add-playlist')}
                        />
                    )}
                    Tạo danh sách phát mới
                </div>
                {createPlaylistDisplay ? (
                    <div className={cx('add-playlist')}>
                        <input
                            type="text"
                            placeholder="Input playlist name..."
                            value={playlistName}
                            onChange={(e) => onChangeHandle(e)}
                            onKeyDown={(e) => createPlaylistHandle(e)}
                        />
                    </div>
                ) : (
                    <></>
                )}
                <div className={cx('playlist-choose-confirm-btn')} onClick={playlistChooseConfirmHandle}>
                    <span>Lưu thay đổi</span>
                </div>
            </div>
            <ToastContainer />
            <label htmlFor={cx('playlist-display')} className={cx('playList-making-wrapper')}></label>
        </>
    )
}
