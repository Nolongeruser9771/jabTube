import classNames from 'classnames/bind'
import styles from './AdminHeader.module.scss'
import { BiHome } from 'react-icons/bi'
import UserContext from '../../../../context/UserContext/UserContext'
import defaultAvatar from '../../../../assets/images/default-avatar.jpg'
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom'
import { logout, setAuth } from '../../../../store/action'
import { ToastContainer, toast } from 'react-toastify'
import { useContext, useState, useEffect } from 'react'

const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

function AdminHeader({ menu, submenu }) {
    //for test only
    // TODO: Do furthur to get userId after successful login
    const { user, dispatchUser, dispatchAuth } = useContext(UserContext)
    const navigate = useNavigate()

    //logout
    const logoutHandle = () => {
        dispatchUser(logout())
        dispatchAuth(setAuth(null))

        toast.info('Bạn đã đăng xuất', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
        })
        setTimeout(() => {
            navigate('/')
        }, 2000)
    }

    //------------------------------avatar fetch---------------------------------------
    const [userAvatar, setUserAvatar] = useState()
    useEffect(() => {
        if (user) {
            getAvatar(user.avatar)
            return
        }
        setUserAvatar(defaultAvatar)
    }, [user])

    //lấy avatar
    const getAvatar = async (avatar) => {
        if (!avatar) {
            setUserAvatar(defaultAvatar)
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
        <>
            <header className={cx('wrapper')}>
                <div className={cx('title')}>
                    <p>
                        {menu ? menu : ''} {submenu ? `≫ ${submenu}` : ''}
                    </p>
                </div>

                <div className={cx('nav-right')}>
                    {user ? (
                        <Link onClick={() => logoutHandle()}>
                            <BiLogOutCircle />
                        </Link>
                    ) : (
                        <Link to={'/login'}>
                            <BiLogInCircle />
                        </Link>
                    )}

                    <Link to={'/'}>
                        <BiHome />
                    </Link>

                    <Link to={user ? `/admin/members/info/${user.id}` : ''}>
                        <img src={userAvatar} className={cx('user-icon')} />
                    </Link>
                </div>
            </header>
            <ToastContainer />
        </>
    )
}

export default AdminHeader
