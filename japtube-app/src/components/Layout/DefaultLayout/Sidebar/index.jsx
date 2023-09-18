import classNames from 'classnames/bind'
import styles from './Sidebar.module.scss'
import home from '@/assets/images/home.png'
import explore from '@/assets/images/explore.png'
import library from '@/assets/images/library.png'
import history from '@/assets/images/history.png'
import playlist from '@/assets/images/playlist.png'
import showmore from '@/assets/images/show-more.png'
import { Link } from 'react-router-dom'

const cx = classNames.bind(styles)

export default function Sidebar() {
    return (
        <div className={cx('sidebar')}>
            <div className={cx('shortcut-links')}>
                <Link to={'/'} className={cx('shortcut-ele')}>
                    <span>
                        <img src={home} />
                        <p>Home</p>
                    </span>
                </Link>
                <Link to={'/explore'} className={cx('shortcut-ele')}>
                    <span href="">
                        <img src={explore} />
                        <p>Explore</p>
                    </span>
                </Link>
                <Link to={'/favorite-film'} className={cx('shortcut-ele')}>
                    <span>
                        <img src={library} />
                        <p>Favorite</p>
                    </span>
                </Link>
                <Link to={'/history'} className={cx('shortcut-ele')}>
                    <span>
                        <img src={history} />
                        <p>History</p>
                    </span>
                </Link>
                <Link to={'/playlist'} className={cx('shortcut-ele')}>
                    <span>
                        <img src={playlist} />
                        <p>Playlist</p>
                    </span>
                </Link>
                <Link to={'/playlist/all'} className={cx('shortcut-ele')}>
                    <span>
                        <img src={showmore} />
                        <p>Shorts</p>
                    </span>
                </Link>
            </div>
        </div>
    )
}
