import classNames from 'classnames/bind'
import styles from './YourVideoList.module.scss'
import Thumbnail from '../../../Home/components/VideoList/components/Thumbnail/Thumbnail'
const API_URL = 'http://localhost:8080'
import { Link } from 'react-router-dom'
import moment from 'moment'

const cx = classNames.bind(styles)

export default function YourVideoList({ videoList, setVideoPreviewHandle }) {
    return (
        <div className={cx('video-list-container')}>
            {videoList.map((watchedVideo) => (
                <div
                    key={watchedVideo.video.id}
                    id={'video-' + watchedVideo.video.id}
                    className={cx('vid-list')}
                    onClick={() =>
                        setVideoPreviewHandle(
                            watchedVideo.video.id,
                            watchedVideo.video.isFree,
                            watchedVideo.video.episode,
                            watchedVideo.video.filmId
                        )
                    }
                >
                    <div className={cx('thumbnail-container')}>
                        <div className={cx('overlay-play')}>
                            <img src="src/assets/images/play.png" alt="" className={cx('play-btn')} />
                        </div>
                        <Link
                            className={cx('thumbnail')}
                            to={`/view-video/${watchedVideo.video.filmId}/${watchedVideo.video.episode}`}
                        >
                            <Thumbnail thumbnail={watchedVideo.video.thumbnail} />
                        </Link>
                    </div>

                    <div className={cx('flex-div')}>
                        <div className={cx('vid-info')}>
                            <p id={cx('title')}>{watchedVideo.video.tittle}</p>
                            <p>
                                {watchedVideo.video.views} Views &bull;{' '}
                                {moment(watchedVideo.video.publishedAt).fromNow()}
                            </p>
                            <p>Tập {watchedVideo.video.episode}</p>
                        </div>
                        <div className={cx('watch-at')}>
                            <p>Bạn đã xem vào {moment(watchedVideo.watchedAt).fromNow()}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
