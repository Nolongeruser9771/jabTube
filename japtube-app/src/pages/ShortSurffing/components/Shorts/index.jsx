import classNames from 'classnames/bind'
import styles from './Shorts.module.scss'
import GridSystem from '../../../../components/GridSystem'
import musicNote from '../../../../assets/images/music-notes.png'
import playingCD from '../../../../assets/images/playing-disk.png'
import close from '../../../../assets/images/close.svg'
import search from '../../../../assets/images/search.png'
import { useEffect, useState } from 'react'
import UserContext from '../../../../context/UserContext/UserContext'
import { useContext } from 'react'
import { DateTime } from 'luxon'
import { BsFillSendPlusFill, BsChatLeftText, BsWindowDash, BsPlayBtn } from 'react-icons/bs'
import PlaylistChoose from '../../../ShortsCut/components/PlaylistChoose'
import { Link } from 'react-router-dom'
import { useInView, useInViewEffect } from 'react-hook-inview'
import { InView } from 'react-intersection-observer'
import { useRef } from 'react'

const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles, GridSystem)

export default function Shorts({ shortsId, userId, handleOpen }) {
    const [display, setDisplay] = useState()
    const [short, setShort] = useState()

    //toggle close
    const displayHandle = () => {
        setDisplay(!display)
    }

    //------------------------------------------Shorts Handle------------------------------------------
    useEffect(() => {
        if (shortsId) {
            const getShortsInfo = async () => {
                const shortFetch = await fetch(API_URL + `/api/v1/shorts/search?shortsId=${shortsId}&userId=${userId}`)
                const res = await shortFetch.json()

                if (!res.message) {
                    setShort(res)
                }
            }
            getShortsInfo()
            getShorts()
        }
    }, [shortsId])

    //view shorts
    const [shortUrl, setShortUrl] = useState()

    const getShorts = async () => {
        if (shortsId) {
            const shortFetch = await fetch(API_URL + `/api/v1/shorts/view-short/${shortsId}?userId=${userId}`)
            const res = await shortFetch.blob()

            if (!res.message) {
                setShortUrl(URL.createObjectURL(res))
            }
        }
    }

    //------------------------------------------Note handle------------------------------------------
    const { user } = useContext(UserContext)

    const [notes, setNotes] = useState([])

    //get note list
    useEffect(() => {
        getNotes(short)
    }, [short])

    const getNotes = async () => {
        if (shortsId) {
            try {
                const noteFetch = await fetch(API_URL + `/api/v1/notes?shortsId=${shortsId}`)
                const res = await noteFetch.json()
                console.log(res)
                if (!res.message) {
                    setNotes(res)
                    console.log(res)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    //Create note
    const [noteInput, setNoteInput] = useState()

    const onChangeHandle = (e) => {
        if (e) {
            setNoteInput(e.target.value)
        }
    }

    const addNoteHandle = async (e) => {
        if ((e.keyCode === 13) & (e.target.value !== '')) {
            //call api
            const noteInput = e.target.value
            try {
                const noteFetch = await fetch(API_URL + `/api/v1/notes/create?userId=${user.id}&shortsId=${shortsId}`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify(noteInput),
                })
                const res = await noteFetch.json()
                if (!res.message) {
                    console.log('new Note')
                    setNotes([res, ...notes])
                    setNoteInput('')
                }
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        }
    }

    //chỉnh sửa bình luận
    const [editingNoteValue, setEditingNoteValue] = useState()
    const [editingNoteId, setEditingNoteId] = useState()
    const [deleteNoteId, setdeleteNoteId] = useState()

    //function to add input Note into dom
    const onUpdateHandle = (note) => {
        setEditingNoteId(note.id)
        setEditingNoteValue(note.content)
        console.log(note)
    }

    //input change
    const handleInputChange = (e) => {
        if (e) {
            setEditingNoteValue(e.target.value)
        }
    }
    //update confirm
    const handleUpdateNoteConfirm = async (e) => {
        if (e.keyCode === 13) {
            try {
                const NoteFetch = await fetch(API_URL + `/api/v1/notes/edit`, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify({
                        noteId: editingNoteId,
                        content: editingNoteValue,
                    }),
                })
                const res = await NoteFetch.json()
                if (!res.message) {
                    console.log('new Note')
                    setNotes(
                        notes.map((note) => {
                            if (note.id === editingNoteId) {
                                return { ...note, content: editingNoteValue }
                            }
                            return note
                        })
                    )
                    setEditingNoteValue('')
                    setEditingNoteId(null)
                }
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        }
    }

    //cancel update
    const onCancelUpdate = () => {
        setEditingNoteId(null)
    }

    //delete Note
    const onDeleteHandle = (note) => {
        setdeleteNoteId(note.id)
    }

    //cancel delete
    const cancelDeleteNoteHandle = () => {
        setdeleteNoteId(null)
    }

    //confirm delete
    const confirmDeleteNoteHandle = async () => {
        try {
            const noteFetch = await fetch(API_URL + `/api/v1/notes/delete?noteId=${deleteNoteId}`, {
                method: 'DELETE',
            })
            const res = await noteFetch.text()
            if (!res.message) {
                console.log('new Note')
                setNotes(notes.filter((note) => note.id != deleteNoteId))
                setdeleteNoteId(null)
            }
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    //------------------------------------------playlist choose menu------------------------------------------
    //xử lí autoplay and pause shorts
    //display playlist choose menu
    const [playlistChooseDisplay, setPlaylistChooseDisplay] = useState()

    const playlistChooseDisplayHandle = () => {
        setPlaylistChooseDisplay(!playlistChooseDisplay)
    }

    //playlist change handle
    const [playlistIds, setPlaylistIds] = useState(short ? short.playlistIds : [])
    const playlistChangeHandle = (updatedList) => {
        setPlaylistIds(updatedList)
    }

    //------------------------------------------in view--------------------------------------------------------
    return (
        <div className={cx('app-container', '.no-gutters', '.wide .row .c-12')} as="div">
            {/* playlist menu */}
            {playlistChooseDisplay ? (
                <PlaylistChoose
                    display={playlistChooseDisplayHandle}
                    playlistIds={short ? (playlistIds.length === 0 ? short.playlistIds : playlistIds) : []}
                    shortsId={shortsId}
                    playlistChangeHandle={playlistChangeHandle}
                />
            ) : (
                <></>
            )}

            <div className={cx('.wide .row .c-o-3')}></div>
            <div className={cx('app__videos', '.wide .row .c-3')}>
                {/* <!-- video starts --> */}
                <div className={cx('video')}>
                    <video
                        className={cx('video__player')}
                        src={shortUrl}
                        loop
                        controls
                        controlsList="nodownload"
                    ></video>

                    {/* <!-- sidebar --> */}
                    <div className={cx('videoSidebar')}>
                        <div className={cx('videoSidebar__button')}>
                            <span className={cx('material-icons')}>
                                <BsWindowDash onClick={() => handleOpen(shortsId)} />
                                <Link to={'/playlist'}>
                                    <BsPlayBtn />
                                </Link>
                                <BsFillSendPlusFill onClick={() => setPlaylistChooseDisplay(!playlistChooseDisplay)} />
                                <BsChatLeftText alt="" onClick={displayHandle} />
                            </span>
                            <p>{notes ? notes.length : ''}</p>
                        </div>
                    </div>

                    {/* <!-- footer --> */}
                    <div className={cx('videoFooter')}>
                        <div className={cx('videoFooter__text')}>
                            <h3>{short ? short.title : ''}</h3>
                            <p className={cx('videoFooter__description')}>
                                {short ? DateTime.fromISO(short.updatedAt).toLocaleString(DateTime.DATE_MED) : ''}
                            </p>

                            <div className={cx('videoFooter__ticker')}>
                                <span className={cx('videoFooter__icon')}>
                                    <img src={musicNote} alt="" />
                                </span>
                                <marquee>{short ? short.description : ''}</marquee>
                            </div>
                        </div>
                        <img src={playingCD} alt="" className={cx('videoFooter__record')} />
                    </div>
                </div>
            </div>

            {display ? (
                <div className={cx('note-container', '.wide .row c-4')}>
                    {/* note */}
                    <div className={cx('note-wrapper')}>
                        <div className={cx('note-list')}>
                            <div className={cx('note-header')}>
                                <h1>Note list</h1>
                                <div className={cx('note-close')} onClick={displayHandle}>
                                    <img src={close} />
                                </div>
                            </div>

                            <div className={cx('note-content')}>
                                {/* render notes */}
                                {notes ? (
                                    notes.map((note) => (
                                        <div className={cx('note')} key={note.id}>
                                            {note.id === editingNoteId ? (
                                                <>
                                                    <div className={cx('note-content-item')}>
                                                        <div className={cx('note-color-mark')}></div>
                                                        <input
                                                            value={editingNoteValue ? editingNoteValue : ''}
                                                            onKeyDown={(e) => handleUpdateNoteConfirm(e)}
                                                            onChange={(e) => handleInputChange(e)}
                                                            type="text"
                                                            placeholder="Write comments....."
                                                        />
                                                    </div>
                                                    <div className={cx('note-modify')}>
                                                        <span onClick={onCancelUpdate}>Huỷ Chỉnh sửa</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className={cx('note-content-item')}>
                                                        <div className={cx('note-color-mark')}></div>
                                                        <span>{note.content}</span>
                                                    </div>
                                                    <div className={cx('note-modify')}>
                                                        <span onClick={() => onUpdateHandle(note)}>Chỉnh sửa</span>
                                                        <span onClick={() => onDeleteHandle(note)}>Xóa</span>
                                                    </div>
                                                </>
                                            )}

                                            {deleteNoteId === note.id ? (
                                                <div className={cx('delete-note-btn')}>
                                                    <p>Bạn chắc chắn muốn xóa ghi chú này?</p>
                                                    <div>
                                                        <span onClick={cancelDeleteNoteHandle}>Hủy bỏ</span>
                                                        <span onClick={confirmDeleteNoteHandle}>Đồng ý</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>

                            {/* note input */}
                            <div className={cx('note-input-wrapper')}>
                                <div className={cx('note-title')}>Input your note</div>
                                <hr />
                                <div className={cx('note-input-box')}>
                                    <input
                                        type="text"
                                        placeholder="What is your note?"
                                        onKeyDown={addNoteHandle}
                                        value={noteInput ? noteInput : ''}
                                        onChange={onChangeHandle}
                                    />
                                    <img src={search} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}
