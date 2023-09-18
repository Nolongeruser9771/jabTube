import classNames from 'classnames/bind'
import styles from './SubtitleGenerator.module.scss'
import close from '../../../../assets/images/close.svg'
import pointer from '../../../../assets/images/pointer.png'
import FilmPlayContext from '../../../../context/PlayFilmContext/FilmPlayContext'
import { useContext, useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { getTimestamps } from '../../../../store/action'
import { Duration } from 'luxon'
const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function SubtitleGenerator({ rewindToTime, subtitleDisplay, subtitles }) {
    const { videoPlay, subtitlePlay, dispatchSubtitlePlay } = useContext(FilmPlayContext)
    const [translateResult, setTranslateResult] = useState()
    const [selectedText, setSelectedText] = useState()
    const selectedTextRef = useRef('')


    //format time
    const duration = (duration) => {
        const durationValue = Duration.fromObject({ second: duration })
        return durationValue.toFormat('hh:mm:ss')
    }

    //point & click to get vocab
    const handleDoubleClick = async () => {
        const selection = window.getSelection()
        if (selection) {
            const selectedText = selection.toString()
            //get current selected text
            selectedTextRef.current = selectedText
            console.log('Selected Text:', selectedText)
            setSelectedText(selectedText)

            //translate
            const translateFetch = await translate(selectedText)
            console.log(translateFetch)
            setTranslateResult(translateFetch)
        }
    }

    //translate
    const translate = async (vocab) => {
        //options to fetch translator

        const encodedParams = new URLSearchParams()
        encodedParams.set('q', vocab)
        encodedParams.set('target', 'vi')
        encodedParams.set('source', 'ja')

        const options = {
            method: 'POST',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '45375f2991mshb004c770204e47cp16a936jsn016b14aed66f',
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
            },
            data: encodedParams,
        }

        try {
            const response = await axios.request(options)
            //list nghĩa
            return response.data.data.translations
        } catch (error) {
            console.error(error)
        }
    }

    //subtitle style
    // const subtitleStyle = (start) => {
    //     if (subtitlePlay.timestamps !== undefined) {
    //         for (const timestamp of subtitlePlay.timestamps) {
    //             if (timestamp.timestamp === start) {
    //                 return { backgroundColor: 'rgb(46, 46, 46, 0.25)' }
    //             }
    //         }
    //         return { backgroundColor: '' }
    //     }
    // }


    return (
        <div className={cx('subtile-container')}>
            <div className={cx('subtitle-header')}>
                <h1>Japanese Subtitle</h1>
                <div className={cx('subtitle-close')} onClick={subtitleDisplay}>
                    <img src={close} />
                </div>
            </div>
            <div onDoubleClick={handleDoubleClick} className={cx('subtitle-generate')}>
                {subtitles ? (
                    subtitles.map((entry, index) => (
                        <div className={cx('subtile-sentence')} key={index}>
                            <div className={cx('timestamp')}>
                                <span onClick={() => rewindToTime(entry.start)}>{duration(entry.start)}</span>
                            </div>
                            <div className={cx('subtitle')}>{entry.text}</div>
                        </div>
                    ))
                ) : (
                    <></>
                )}
            </div>
            {/* translate */}
            <div className={cx('translate-wrapper')} id="translate-wrapper">
                <div className={cx('result-wrapper')}>
                    <div className={cx('word')}>{selectedText ? selectedText : 'Từ muốn tra'}</div>
                    <hr />
                    {/* <div className={cx('phonetic')}>さあ こたえ</div> */}
                    <div className={cx('lists-mean')}>
                        <ul>
                            {translateResult ? (
                                translateResult.map((trans, index) => (
                                    <li key={index}>
                                        <img width={25} src={pointer} />
                                        <span>{trans.translatedText}</span>
                                    </li>
                                ))
                            ) : (
                                <img width={25} src={pointer} />
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
