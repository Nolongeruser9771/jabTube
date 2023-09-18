import classNames from 'classnames/bind'
import styles from './ExploreBanner.module.scss'
import { Link } from 'react-router-dom'
import backBanner  from '../../../../assets/images/BackGround-banner.jpg'

const cx = classNames.bind(styles)

export default function ExploreBanner() {
    return (
        <div className={cx('backbanner')}>
            <img src={backBanner} alt="" />
            <div className={cx('content-banner')}>
                <h1>Japtube Channel</h1>
                <Link to={'/explore'}>
                    <button className={cx('btn-banner')}>Explore</button>
                </Link>
            </div>
        </div>
    )
}
