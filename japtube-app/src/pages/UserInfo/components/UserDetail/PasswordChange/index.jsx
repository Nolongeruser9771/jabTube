import classNames from 'classnames/bind'
import styles from './PasswordChange.module.scss'
import GridSystem from '../../../../../components/GridSystem'
const API_URL = 'http://localhost:8080'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import UserContext from '../../../../../context/UserContext/UserContext'
import { setAuth } from '../../../../../store/action'
import { ToastContainer, toast } from 'react-toastify'
import { Modal, Box, Button, Input } from '@mui/material'

const cx = classNames.bind(styles, GridSystem)

export default function PasswordChange() {
    const [message, setMessage] = useState()
    const navigate = useNavigate()
    const { user, auth, dispatchAuth } = useContext(UserContext)

    //Khai báo validation cho từng trường
    const schema = yup
        .object({
            password: yup.string().required('Password không được bỏ trống'),
            passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Password phải khớp nhau'),
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
        const changePassRequest = {
            email: user.email,
            password: data.password,
            confirmPassword: data.passwordConfirm,
        }

        console.log(changePassRequest)
        toast.warning('Please wait...', {
            autoClose: 2500,
        })
        
        try {
            const changePass = await fetch(API_URL + '/api/v1/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(changePassRequest),
            })
            const res = await changePass.json()
            console.log(res)

            if (!res.message) {
                setMessage('Đổi mật khẩu thành công')
                toast.success('Đổi mật khẩu thành công', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                })
                //set auth
                dispatchAuth(setAuth(res))
            }

            setMessage(res.message)
            toast.error(res.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 500,
            })
        } catch (error) {
            console.log(error)
        }
    }

    //--------------------------------Modal to allow change pass-------------------
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
    const [isAllowToChangePass, setIsAllowToChangePass] = useState(false)

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const [oldPassInput, setOldPassInput] = useState()

    const onKeyDownHandle = (e) => {
        if (e.keyCode === 13) {
            console.log(oldPassInput)
            requestChangePasswordHandle()
        }
    }

    const requestChangePasswordHandle = async () => {
        if (!oldPassInput || !user) {
            return
        }
        const changePassRequest = await fetch(
            API_URL + `/api/v1/auth/request-change-password?oldPassword=${oldPassInput}&email=${user.email}`,
            {
                method: 'POST',
            }
        )
        const response = await changePassRequest.json()
        if (response.status === 'OK') {
            toast.success(response.data, {
                autoClose: 1000,
            })
            handleClose()
            setIsAllowToChangePass(true)
            return
        }
        toast.error(response.message, {
            autoClose: 1000,
        })
        setIsAllowToChangePass(false)
        handleClose()
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
                    <h3>Nhập mật khẩu hiện tại của bạn: </h3>
                    <Input
                        type="password"
                        style={{ width: '100%', fontSize: '1.2rem' }}
                        placeholder="Enter your registered password..."
                        onChange={(e) => setOldPassInput(e.target.value)}
                        onKeyDown={(e) => onKeyDownHandle(e)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'right' }}>
                        <Button style={{ fontSize: '1.6rem' }} onClick={handleClose}>
                            Hủy
                        </Button>
                        <Button style={{ fontSize: '1.6rem' }} onClick={() => requestChangePasswordHandle()}>
                            Gửi
                        </Button>
                    </div>
                </Box>
            </Modal>

            <div className={cx('row')}>
                <div className={cx('change-btn', 'password-change')} onClick={handleOpen}>
                    Thay đổi mật khẩu
                </div>
            </div>

            {isAllowToChangePass ? (
                <div className={cx('change-pass-container')}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={cx('row')}>
                            <div className="password col l-3">
                                <label htmlFor="">Password</label>
                            </div>

                            <div className="col l-8">
                                <input type="password" placeholder="Nhập password của bạn" {...register('password')} />
                                <p className={cx('text-danger')}>{errors.password?.message}</p>
                            </div>
                        </div>
                        <div className={cx('row')}>
                            <div className="password-confirm col l-3">
                                <label htmlFor="">Nhập lại password</label>
                            </div>

                            <div className="col l-8">
                                <input
                                    type="password"
                                    placeholder="Nhập lại password của bạn"
                                    {...register('passwordConfirm')}
                                />
                                <p className={cx('text-danger')}>{errors.passwordConfirm?.message}</p>
                                <p className={cx('text-danger')}>{message ? message : ''}</p>
                            </div>
                        </div>
                        <div className={cx('row', 'confirm')}>
                            <button className={cx('change-btn')} type="submit">
                                Xác nhận đổi mật khẩu
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}
