import classNames from 'classnames/bind'
import styles from './VideoInfo.module.scss'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Thumbnail from '../../../../../Home/components/VideoList/components/Thumbnail/Thumbnail'
const API_URL = 'http://localhost:8080'
import FilmPlayContext from '../../../../../../context/PlayFilmContext/FilmPlayContext'
import UserContext from '../../../../../../context/UserContext/UserContext'
import { useContext } from 'react'
import { addFavorite, likeFilm, removeFavorite, unLikeFilm } from '../../../../../../store/action'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AiFillSketchCircle } from 'react-icons/ai'
import MDEditor, { commands, title } from '@uiw/react-md-editor'

const cx = classNames.bind(styles)

export default function VideoInfo() {
    const { user } = useContext(UserContext)
    const { filmPlay, dispatchFilmPlay, likedFilms, dispatchLikedFilms, videoPlay } = useContext(FilmPlayContext)

    const [thumbnail, setThumbnail] = useState()
    useEffect(() => {
        if (filmPlay.id !== undefined) {
            setThumbnail(filmPlay.thumbnail)
        }
    }, [filmPlay])

    //---------------------------------add/remove from favorite list---------------------------------
    const [isLiked, setIsLiked] = useState(false)
    //check if film is liked
    useEffect(() => {
        console.log('likeFilms', likedFilms)
        console.log('isLiked', isLiked)
        if (likedFilms) {
            let likedList = likedFilms.map((likeFilm) => likeFilm.id)
            likedList.includes(filmPlay.id) ? setIsLiked(true) : setIsLiked(false)
        }
    }, [filmPlay])

    const onAddFavoriteFilmHandle = async () => {
        if (!user) {
            toast.error('Bạn cần đăng nhập để thực hiện chức năng này', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            })
        } else {
            try {
                const like = await fetch(API_URL + `/api/v1/films/${filmPlay.id}?userId=${user.id}`, {
                    method: 'POST',
                })
                const res = await like.json()
                console.log(res)
                if (!res.message) {
                    //update likedFilm list
                    dispatchLikedFilms(addFavorite(filmPlay))

                    //update likes
                    dispatchFilmPlay(likeFilm())
                    setIsLiked(true)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const onRemoveFavoriteFilmHandle = async () => {
        if (!user) {
            toast.error('Bạn cần đăng nhập để thực hiện chức năng này', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            })
        } else {
            try {
                const unlike = await fetch(API_URL + `/api/v1/films/${filmPlay.id}?userId=${user.id}`, {
                    method: 'DELETE',
                })
                const res = await unlike.text()
                console.log(res)
                if (!res.message) {
                    //update likedFilm list
                    dispatchLikedFilms(removeFavorite(filmPlay))

                    //update likes
                    dispatchFilmPlay(unLikeFilm())
                    setIsLiked(false)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div>
            <div className={cx('film-avatar')}>
                <span id={cx('thumbnail-avatar')}>
                    <Thumbnail thumbnail={thumbnail} />
                </span>

                <div id={cx('film-title')}>
                    <h4>{filmPlay ? filmPlay.title : ''}</h4>
                    <span className={cx('title')}>{filmPlay ? filmPlay.likes : ''} Likes</span>
                </div>

                {isLiked ? (
                    <button style={{ backgroundColor: 'gray' }} onClick={onRemoveFavoriteFilmHandle} type="button">
                        Xóa khỏi danh sách yêu thích
                    </button>
                ) : (
                    <button onClick={onAddFavoriteFilmHandle} type="button">
                        Thêm vào danh sách yêu thích
                    </button>
                )}
            </div>
            <div className={cx('vid-description')}>
                <div>
                    Số tập phim{' '}
                    {filmPlay.id !== undefined ? filmPlay.videoPublics.length + '/' + filmPlay.totalEpisode : ''}
                </div>

                <div className={cx('episode-container')}>
                    {filmPlay.id !== undefined ? (
                        filmPlay.videoPublics.map((video, index) => (
                            <Link
                                style={
                                    videoPlay.episode === video.episode
                                        ? { backgroundColor: 'rgb(118, 6, 6, 0.85)' }
                                        : { backgroundColor: 'rgb(118, 6, 6, 0.5)' }
                                }
                                to={`/view-video/${video.filmId}/${video.episode}`}
                                key={index}
                                className={cx('episode')}
                                id={cx(`play-video-${video.id}`)}
                            >
                                {video.episode}

                                {video.isFree ? <></> : <AiFillSketchCircle style={{position: 'absolute', marginTop: '-20px', marginLeft: '22px', color: '#F9E79F'}}/>}
                            </Link>
                        ))
                    ) : (
                        <>Loading...</>
                    )}
                </div>

                <MDEditor.Markdown
                    style={{ marginTop: '10px', whiteSpace: 'pre-wrap', backgroundColor: 'transparent' }}
                    source={filmPlay ? filmPlay.description : ''}
                />
            </div>
            <ToastContainer />
        </div>
    )
}
