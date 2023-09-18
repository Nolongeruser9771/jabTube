import classNames from 'classnames/bind'
import { useState } from 'react'
const API_URL = 'http://localhost:8080'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import styles from '../../../pages/Login/Login.module.scss'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import secureLocalStorage from 'react-secure-storage'

const cx = classNames.bind(styles)

export default function Signup() {
    const [message, setMessage] = useState()

    //Khai báo validation cho từng trường
    const schema = yup
        .object({
            username: yup.string().required('Username không được bỏ trống'),
            password: yup.string().required('Password không được bỏ trống'),
            email: yup
                .string()
                .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email không hợp lệ')
                .required('Email không được bỏ trống'),
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
        secureLocalStorage.setItem('accountCreateRequest', data)
        toast.warning('Please wait...', {
            autoClose: 2500
        })

        try {
            const result = await fetch(API_URL + `/api/v1/users/create-token-request?email=${data.email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            })
            const accountVerifyToken = await result.json()
            console.log(accountVerifyToken)

            if (accountVerifyToken.status === 'OK') {
                secureLocalStorage.setItem('accountCreateRequest', data)
                secureLocalStorage.setItem('accountVerifyToken', accountVerifyToken.data)
                toast.success(
                    'Yêu cầu tạo tài khoản thành công! Mời đăng nhập email và verify link để hoàn thành bước cuối cùng!',
                    {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 500,
                    }
                )
            } else {
                toast.error(accountVerifyToken.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" name="txt" placeholder="User name" required="" {...register('username')} />
            <p className={cx('text-danger')}>{errors.username?.message}</p>
            <input type="email" name="email" placeholder="Email" required="" {...register('email')} />
            <p className={cx('text-danger')}>{errors.email?.message}</p>
            <input type="password" name="pswd" placeholder="Password" required="" {...register('password')} />
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
            <button>Sign up</button>
        </form>
    )
}
