import styles from './AdminLayout.module.scss'
import LeftSideBar from './components/LeftSideBar'
import classNames from 'classnames/bind'
import AdminHeader from './components/Header'
import { useState } from 'react'

const cx = classNames.bind(styles)

function AdminLayout({ children }) {
    const [menu, setMenu] = useState('Báo cáo')
    const [submenu, setSubmenu] = useState()
    return (
        <div className={cx('admin-page-wrapper')}>
            <LeftSideBar setMenu={setMenu} setSubmenu={setSubmenu} />
            <AdminHeader menu={menu} submenu={submenu} />
            <div className={cx('right-side-content')}>
                {/* Page Content */}
                <div className={cx('admin-page-content')}>{children}</div>
            </div>
        </div>
    )
}

export default AdminLayout
