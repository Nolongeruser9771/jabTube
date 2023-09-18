import classNames from 'classnames/bind'
import styles from './YourFilmList.module.scss'
import Thumbnail from '../../../Home/components/VideoList/components/Thumbnail/Thumbnail'
import Level from '../../../Home/components/VideoList/components/Level/Level'
import play from '../../../../assets/images/play.png'
import moment from 'moment'
import { Link } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor'
const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function YourFilmList({ filmList, setPreviewFilmHandle }) {
    return (
        <div className={cx('video-list-container')}>
            {filmList.map((film) => (
                <div
                    key={film.film.id}
                    id={'film-' + film.film.id}
                    className={cx('vid-list')}
                    onClick={() => setPreviewFilmHandle(film.film.id)}
                >
                    <div className={cx('thumbnail-container')}>
                        <div className={cx('overlay-play')}>
                            <img src={play} alt="" className={cx('play-btn')} />
                        </div>
                        <Link to={`/view-video/${film.film.id}/1`} className={cx('thumbnail')}>
                            <Thumbnail thumbnail={film.film.thumbnail} />
                        </Link>
                    </div>

                    <div className={cx('flex-div')}>
                        <div className={cx('vid-info')}>
                            <p id={cx('title')}>{film.film.title}</p>
                            <p>
                                {film.film.totalViews} Views &bull; {moment(film.film.publishedAt).fromNow()}
                            </p>
                            <MDEditor.Markdown
                                style={{
                                    marginTop: '5px',
                                    backgroundColor: 'transparent',
                                    boxSizing: 'border-box',
                                    height: '50px',
                                    overflowY: 'hidden',
                                }}
                                source={film.film.description}
                            />
                        </div>
                        <Level level={film.film.level} />
                    </div>
                </div>
            ))}
        </div>
    )
}
