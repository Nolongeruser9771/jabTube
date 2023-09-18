import { useState } from 'react'
import filmPlayReducer, { initFilmPlay } from '../../store/filmPlayReducer'
import likedFilmsReducer, { initLikedFilms } from '../../store/likedFilmsReducer'
import subtitlePlayReducer, { initSubtitlePlay } from '../../store/subtitlePlayReducer'
import videoPlayReducer, { initVideoPlay } from '../../store/videoPlayReducer'
import FilmPlayContext from './FilmPlayContext'
import { useReducer } from 'react'
import videosReducer, { initVideoList } from '../../store/VideosReducer'

function FilmPlayContextProvider({ children }) {
    const [filmPlay, dispatchFilmPlay] = useReducer(filmPlayReducer, initFilmPlay)
    const [videoPlay, dispatchVideoPlay] = useReducer(videoPlayReducer, initVideoPlay)
    const [subtitlePlay, dispatchSubtitlePlay] = useReducer(subtitlePlayReducer, initSubtitlePlay)
    const [likedFilms, dispatchLikedFilms] = useReducer(likedFilmsReducer, initLikedFilms)
    const [videoList, dispatchVideoList] = useReducer(videosReducer, initVideoList)

    const value = {
        filmPlay,
        videoPlay,
        dispatchFilmPlay,
        dispatchVideoPlay,
        subtitlePlay,
        dispatchSubtitlePlay,
        likedFilms,
        dispatchLikedFilms,
        videoList,
        dispatchVideoList,
    }

    return <FilmPlayContext.Provider value={value}>{children}</FilmPlayContext.Provider>
}

export default FilmPlayContextProvider
