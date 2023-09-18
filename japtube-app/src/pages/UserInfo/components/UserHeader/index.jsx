import classNames from 'classnames/bind'
import styles from './UserHeader.module.scss'
const API_URL = 'http://localhost:8080'
import { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import UserContext from '../../../../context/UserContext/UserContext'
import { updateProfile } from '../../../../store/action'
import defaultAvatar from '../../../../assets/images/default-avatar.jpg'
import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

const cx = classNames.bind(styles)

export default function UserHeader() {
    const { user, dispatchUser } = useContext(UserContext)
    const location = useLocation()
    const [userAvatar, setUserAvatar] = useState()

    //handle upload image
    const handleUpload = async (e) => {
        //lấy file, tạo formData
        if (e.target.files[0] === 'underfined' || e.target.files[0] === null) {
            return
        }

        let file = e.target.files[0]
        if (file.type !== 'jpg' && file.type !== 'png' && file.type !== 'image/jpeg') {
            toast.error('Định dạng ảnh không phù hợp. Xin tải ảnh png/jpg!', {
                autoClose: 1000,
            })
            return
        }

        let formData = new FormData()
        formData.append('file', file)

        console.log(file)
        if (!user) {
            return
        }

        try {
            const uploadImage = await fetch(API_URL + '/api/v1/images/avatar/post?userId=' + user.id, {
                method: 'POST',
                body: formData,
            })
            const res = await uploadImage.arrayBuffer()
            const arrayBufferView = new Uint8Array(res)
            const blob = new Blob([arrayBufferView], { type: 'image/jpeg' })
            setUserAvatar(URL.createObjectURL(blob))
        } catch (error) {
            console.log(error)
        }
    }

    // //---------------------------------------------update avatar blob----------------------------------------
    // const [userAvatar, setUserAvatar] = useState()
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
        <div className={cx('user-header-container')}>
            <div className={cx('user-info')}>
                <input hidden type="file" name="file" id={cx('upload-avatar')} onChange={(e) => handleUpload(e)} />
                <label className={cx('user-avatar')} htmlFor="upload-avatar">
                    <img src={userAvatar} alt="" />
                </label>
                <div className={cx('detail-info')}>
                    <div>{user ? user.username : ''}</div>
                    <div>{user ? user.email : ''}</div>
                </div>
            </div>
            <div className={cx('tag')}>
                {location.pathname.includes('admin') ? (
                    <Link to={`/admin/members/info/${user.id}`} className={cx('tag-ele')}>
                        Thông tin cá nhân & mật khẩu
                    </Link>
                ) : (
                    <>
                        <Link to={'/user-page'} className={cx('tag-ele')}>
                            Thông tin cá nhân
                        </Link>
                        <Link to={'/package-info'} className={cx('tag-ele')}>
                            Thông tin tài khoản
                        </Link>
                        <Link to={'/playlist'} className={cx('tag-ele')}>
                            Danh sách phát của bạn
                        </Link>
                    </>
                )}
            </div>
            <div></div>
        </div>
    )
}
