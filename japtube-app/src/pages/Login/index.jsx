import classNames from 'classnames/bind'
import styles from './Login.module.scss'
import { useState, useEffect } from 'react'
const API_URL = 'http://localhost:8080'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import UserContext from '../../context/UserContext/UserContext'
import { useContext } from 'react'
import { login, setAuth, updateProfile } from '../../store/action'
import Signup from './Signup/Signup'
import { Modal, Box, Button, Input } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import secureLocalStorage from 'react-secure-storage'

const cx = classNames.bind(styles)

export default function Login() {
    //--------------------------------------login handle-----------------------------------

    const [message, setMessage] = useState()
    const { user, dispatchUser, dispatchAuth } = useContext(UserContext)

    const navigate = useNavigate()

    //Khai báo validation cho từng trường
    const schema = yup
        .object({
            password: yup.string().required('Password không được bỏ trống'),
            email: yup
                .string()
                .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email không hợp lệ')
                .required('Email không được bỏ trống'),
        })
        .required()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        //truyền schema vào
        resolver: yupResolver(schema),
        mode: 'all',
    })

    const onSubmit = async (data) => {
        try {
            const result = await fetch(API_URL + '/api/v1/auth/login-handle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(data),
            })
            const loginResponse = await result.json()

            if (loginResponse.status) {
                setMessage(loginResponse.message)
                toast.error('Đăng nhập thất bại!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                })
                return
            }

            const getProfile = await fetch(API_URL + `/api/v1/users/profile?email=${data.email}`)
            const userProfile = await getProfile.json()

            if (userProfile.message) {
                console.log(updateProfile.message)
                return
            }

            setMessage('Login successfully!')
            toast.success('Đăng nhập thành công!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 500,
            })

            //lưu thông tin đăng nhập thành công (profile +  auth)
            dispatchUser(login(userProfile))
            dispatchAuth(setAuth(loginResponse))

            setTimeout(() => {
                navigate('/')
            }, 1000)
        } catch (error) {
            console.log(error)
        }
    }

    //---------------------------------------------forgot pass----------------------------------------
    //Modal
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 1,
        pt: 2,
        px: 4,
        pb: 3,
    }

    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const [confirmEmail, setConfirmEmail] = useState()

    const onKeyDownHandle = (e) => {
        if (e.keyCode === 13) {
            console.log(confirmEmail)
            forgotPasswordHandle()
        }
    }

    const forgotPasswordHandle = async () => {
        toast.warning('Please wait...', {
            autoClose: 2500,
        })
        try {
            const forgotPassFetch = await fetch(API_URL + `/api/v1/auth/forgot-password?email=${confirmEmail}`, {
                method: 'POST',
            })
            const res = await forgotPassFetch.json()
            if (res.status === 'OK') {
                secureLocalStorage.setItem('forgotPassConfirmToken', res.data)
                handleClose()
                toast.success('Yêu cầu reset mật khẩu thành công! Kiểm tra mail để xác thực!', {
                    autoClose: 500,
                })
                return
            }
            toast.error(res.message, {
                autoClose: 500,
            })
            handleClose()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h3>Nhập email đăng nhập của bạn: </h3>
                    <Input
                        type="email"
                        style={{ width: '100%', fontSize: '1.2rem' }}
                        placeholder="Enter your registered email..."
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        onKeyDown={(e) => onKeyDownHandle(e)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'right' }}>
                        <Button style={{ fontSize: '1.6rem' }} onClick={handleClose}>
                            Hủy
                        </Button>
                        <Button style={{ fontSize: '1.6rem' }} onClick={() => forgotPasswordHandle()}>
                            Gửi
                        </Button>
                    </div>
                </Box>
            </Modal>

            {/* Login */}
            <input type="checkbox" defaultChecked id={cx('login-close-check')} hidden />
            <label htmlFor={cx('login-close-check')} className={cx('overlay-login')}>
                <div className={cx('login-container')}>
                    <input type="checkbox" defaultChecked id={cx('chk')} aria-hidden="true" />
                    <div className={cx('signup')}>
                        <label htmlFor={cx('chk')} aria-hidden="true">
                            Sign up
                        </label>
                        <Signup />
                    </div>

                    <div className={cx('login')}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <label htmlFor={cx('chk')} aria-hidden="true">
                                Login
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                required=""
                                {...register('email')}
                            />
                            <p className={cx('text-danger')}>{errors.email?.message}</p>
                            <input
                                type="password"
                                name="pswd"
                                id="password"
                                placeholder="Password"
                                required=""
                                {...register('password')}
                            />
                            <p className={cx('text-danger')}>{errors.password?.message}</p>
                            <button type="submit">Login</button>
                            <span onClick={() => handleOpen()}>
                                <p>Forgot password?</p>
                            </span>
                            <p className={cx('text-danger')}>{message ? message : ''}</p>
                        </form>
                    </div>
                </div>
            </label>
            <ToastContainer />
        </div>
    )
}
