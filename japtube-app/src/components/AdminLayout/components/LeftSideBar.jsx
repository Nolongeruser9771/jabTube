import styles from '../../AdminLayout/AdminLayout.module.scss'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { FaChartBar, FaYoutube, FaMoneyBillAlt, FaNewspaper, FaUsers, FaUserEdit } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import UserContext from '@/context/UserContext/UserContext'
import classNames from 'classnames/bind'
import { useContext, useState, useEffect } from 'react'
import DefaultAvatar from '../../../assets/images/default-avatar.jpg'

const API_URL = 'http://localhost:8080'
const cx = classNames.bind(styles)

function LeftSideBar({ setMenu, setSubmenu }) {
    const { user } = useContext(UserContext)
    console.log(user)

    const navigateSidebar = [
        {
            title: 'Báo cáo',
            url: null,
            icon: <FaChartBar />,
            submenu: [
                {
                    title: 'Báo cáo tổng quát',
                    url: '/admin/dashboard',
                },
            ],
        },
        {
            title: 'Quản lí Phim & Phụ đề',
            url: null,
            icon: <FaYoutube />,
            submenu: [
                {
                    title: 'Thông tin phim',
                    url: '/admin/films',
                },
                {
                    title: 'Quản lí Category',
                    url: '/admin/categories',
                },
            ],
        },
        {
            title: 'Duyệt đơn hàng',
            url: '/admin/orders',
            icon: <FaMoneyBillAlt />,
        },
        {
            title: 'Quản lí user',
            url: '/admin/users',
            icon: <FaUserEdit />,
        },
        {
            title: 'Thông tin Website',
            url: '',
            icon: <FaNewspaper />,
        },
        {
            title: 'Thành viên',
            url: '/admin/members',
            icon: <FaUsers />,
        },
    ]

    const menuTitleChangeHandle = (menuTitle) => {
        setMenu(menuTitle)
        setSubmenu(null)
    }

    //------------------------------avatar fetch---------------------------------------
    const [userAvatar, setUserAvatar] = useState()
    useEffect(() => {
        if (user) {
            getAvatar(user.avatar)
            return
        }
        setUserAvatar(DefaultAvatar)
    }, [user])

    //lấy avatar
    const getAvatar = async (avatar) => {
        if (!avatar) {
            setUserAvatar(DefaultAvatar)
            return
        }
        try {
            const avatarFetch = await fetch(API_URL + avatar)
            const res = await avatarFetch.blob()
            setUserAvatar(URL.createObjectURL(res))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Sidebar className={cx('admin-sidebar')}>
            <div className={cx('profile')}>
                <img src={userAvatar} alt="" />
                <div className="user-info">{user ? user.username : ''}</div>
            </div>
            <Menu className={cx('sidebar-menu')}>
                {navigateSidebar.map((nav, index) => {
                    if (nav.submenu) {
                        return (
                            <SubMenu
                                key={index}
                                label={nav.title}
                                icon={nav.icon}
                                onClick={() => menuTitleChangeHandle(nav.title)}
                            >
                                {nav.submenu.map((sub, index) => (
                                    <MenuItem
                                        key={index}
                                        component={<Link to={sub.url} />}
                                        onClick={() => setSubmenu(sub.title)}
                                    >
                                        {sub.title}
                                    </MenuItem>
                                ))}
                            </SubMenu>
                        )
                    } else {
                        return (
                            <MenuItem
                                key={index}
                                icon={nav.icon}
                                component={<Link to={nav.url} />}
                                onClick={() => menuTitleChangeHandle(nav.title)}
                            >
                                {nav.title}
                            </MenuItem>
                        )
                    }
                })}
            </Menu>
        </Sidebar>
    )
}

export default LeftSideBar
