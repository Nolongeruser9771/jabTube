import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import { useContext, useEffect, useState } from 'react'
import logo from '../../../../assets/images/logo.png'
import { BiMenu, BiBell, BiLogInCircle, BiCreditCard, BiLogOutCircle, BiUserCircle } from 'react-icons/bi'
import SearchBox from './SearchBox/SearchBox'
import UserContext from '../../../../context/UserContext/UserContext'
import { logout, setAuth } from '../../../../store/action'
import defaultAvatar from '../../../../assets/images/default-avatar.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import secureLocalStorage from 'react-secure-storage'

const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

function Header() {
    //for test only
    // TODO: Do furthur to get userId after successful login
    const { user, dispatchUser } = useContext(UserContext)
    const navigate = useNavigate()

    //logout
    const logoutHandle = () => {
        setTimeout(() => {
            navigate('/')
        }, 50)

        setTimeout(() => {
            setAuth(null)
            dispatchUser(logout())
            setIsAdmin(false)
            secureLocalStorage.clear()
        }, 1000)

        toast.info('Bạn đã đăng xuất', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
        })
        console.log(user)
    }

    //check role to display admin page
    const [isAdmin, setIsAdmin] = useState()
    useEffect(() => {
        if (user) {
            user.roles.map((role) => {
                if (role.role === 'ADMIN') {
                    setIsAdmin(true)
                }
            })
        }
    }, [user])

    //---------------------------------------------update avatar blob----------------------------------------
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
        <div className="page-wrapper">
            {/* Header */}
            <header className={cx('wrapper')}>
                <div className={cx('nav-left')}>
                    <Link to={'/'}>
                        <BiMenu />
                    </Link>
                    <Link to={'/'}>
                        <img src={logo} alt="error" className={cx('logo')} />
                    </Link>
                </div>

                <SearchBox />

                <div className={cx('nav-right')}>
                    <label htmlFor={cx('login-close-check')} className={cx('login-pops-up')}>
                        {user ? (
                            <Link onClick={() => logoutHandle()}>
                                <BiLogOutCircle />
                            </Link>
                        ) : (
                            <Link to={'/login'}>
                                <BiLogInCircle />
                            </Link>
                        )}
                    </label>
                    <Link to={'/buy-package'}>
                        <BiCreditCard />
                    </Link>

                    {isAdmin === true ? (
                        <Link to={'/admin/dashboard'}>
                            <BiUserCircle />
                        </Link>
                    ) : (
                        <></>
                    )}

                    <Link to={'/user-page'}>
                        <img src={userAvatar} className={cx('user-icon')} />
                    </Link>
                </div>
            </header>
            <ToastContainer />
        </div>
    )
}

export default Header
