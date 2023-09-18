import styles from './forgotPassword.module.scss'
import classNames from 'classnames/bind'
const API_URL = 'http://localhost:8080'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState, useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
const cx = classNames.bind(styles)
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function forgotPassword() {
    const [message, setMessage] = useState()
    const navigate = useNavigate()

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
        const confirmToken = secureLocalStorage.getItem('forgotPassConfirmToken')
        const resetPassRequest = {
            password: data.password,
            confirmPassword: data.passwordConfirm,
            confirmToken: confirmToken,
        }

        console.log(resetPassRequest)

        try {
            const resetPass = await fetch(API_URL + '/api/v1/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(resetPassRequest),
            })
            const res = await resetPass.json()

            if (res.status === 'OK') {
                setMessage(res.data)
                toast.success(res.data, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                })
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
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

    return (
        <>
            <div className={cx('forgotpass-container')}>
                <h2>Đổi mật khẩu</h2>

                <div className={cx('reset-password')}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="password"
                            name="pswd"
                            placeholder="Password"
                            required=""
                            {...register('password')}
                        />
                        <p className={cx('text-danger')}>{errors.password?.message}</p>
                        <input
                            type="password"
                            name="pswd"
                            placeholder="Password Confirm"
                            required=""
                            {...register('passwordConfirm')}
                        />
                        <p className={cx('text-danger')}>{errors.passwordConfirm?.message}</p>
                        <p className={cx('text-danger')}>{message ? message : ''}</p>
                        <button>Xác nhận</button>
                    </form>
                </div>
            </div>

            <ToastContainer />
        </>
    )
}
