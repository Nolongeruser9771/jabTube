import classNames from 'classnames/bind'
import styles from './VideoSlider.module.scss'
import Thumbnail from '../../../Home/components/VideoList/components/Thumbnail/Thumbnail'
import play from '../../../../assets/images/play.png'
import { Link } from 'react-router-dom'
import moment from 'moment'

const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function VideoSlider({ video }) {
    return (
        <div className={cx('list-container')}>
            <Link
                to={`/view-video/${video.filmId}/${video.episode}`}
                key={video.id}
                id={'video-' + video.id}
                className={cx('vid-list')}
            >
                <div className={cx('overlay-play')}>
                    <img src={play} alt="" className={cx('play-btn')} />
                </div>

                <Thumbnail thumbnail={video.thumbnail} />

                <div className={cx('flex-div')}>
                    <div className={cx('vid-info')}>
                        <p id={cx('title')}>{video.tittle}</p>
                        <p>
                            Tập {video.episode} &bull; {moment(video.publishedAt).fromNow()}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    )
}
