import classNames from 'classnames/bind'
import styles from './UserInfo.module.scss'
import UserHeader from './components/UserHeader'

const cx = classNames.bind(styles)

export default function UserInfo({ children }) {
    
    return (
        <div className={cx('user-page-container')}>
            
            <div className={cx('user-page-header')}>
                <UserHeader />
                <hr />
                <div className={cx('user-tag')}>{children}</div>
            </div>
        </div>
    )
}
