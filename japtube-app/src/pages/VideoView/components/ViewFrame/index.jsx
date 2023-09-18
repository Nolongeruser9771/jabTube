import classNames from 'classnames/bind'
import styles from './ViewFrame.module.scss'
import Comments from './components/Comments'
import VideoPlay from './components/VideoPlay'
import VideoInfo from './components/VideoInfo'

const cx = classNames.bind(styles)

export default function ViewFrame({ subtitleDisplay, timeMarks }) {
    return (
        <div className={cx('video-container')}>
            <VideoPlay subtitleDisplay={subtitleDisplay} timeMarks={timeMarks} />
            <hr />

            <VideoInfo />
            <Comments />
        </div>
    )
}
