import classNames from 'classnames/bind'
import styles from './UserDetail.module.scss'
import GridSystem from '../../../../components/GridSystem'
import PasswordChange from './PasswordChange'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
const API_URL = 'http://localhost:8080'
import { useContext, useState } from 'react'
import UserContext from '../../../../context/UserContext/UserContext'
import { updateProfile } from '../../../../store/action'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const cx = classNames.bind(styles, GridSystem)

function UserDetail() {
    const [message, setMessage] = useState()
    const { user, dispatchUser } = useContext(UserContext)

    //Khai báo validation cho từng trường
    const schema = yup
        .object({
            username: yup.string().required('Username không được bỏ trống'),
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
        //set default value
        defaultValues: {
            username: user ? user.username : '',
            email: user ? user.email : '',
        },
        //truyền schema vào
        resolver: yupResolver(schema),
        mode: 'all',
    })

    const onSubmit = async (data) => {
        try {
            console.log(data)
            const result = await fetch(API_URL + '/api/v1/users/' + user.id + '/update-user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(data),
            })
            const res = await result.json()
            console.log(res)
            if (res.message) {
                setMessage(res.message)
            } else {
                setMessage('Successfully updated!')
                toast.success('Cập nhật thông tin thành công', {
                    autoClose: 500,
                })

                //cập nhật lại user
                dispatchUser(updateProfile({ username: res.username, email: res.email }))
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={cx('user-detail-container')}>
            <div className={cx('user-basic-info')}>
                <div className={cx('text-danger')}>{message ? message : ''}</div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={cx('row')}>
                        <div className="username col l-3">
                            <label htmlFor="">Username</label>
                        </div>

                        <div className="col l-8">
                            <input
                                type="text"
                                id="username"
                                placeholder="Nhập username của bạn"
                                {...register('username')}
                            />
                        </div>
                    </div>
                    <p className={cx('text-danger')}>{errors.username?.message}</p>
                    <div className={cx('row')}>
                        <div className="email col l-3">
                            <label htmlFor="">Email</label>
                        </div>

                        <div className="col l-8">
                            <input type="text" id="email" placeholder="Nhập email của bạn" {...register('email')} />
                        </div>
                    </div>
                    <p className={cx('text-danger')}>{errors.email?.message}</p>
                    <div className={cx('row', 'confirm')}>
                        <button type="submit" className={cx('change-btn')} id="btn-save">
                            Xác nhận thay đổi
                        </button>
                    </div>
                </form>

                <hr />
                <PasswordChange />
            </div>
            <ToastContainer />
        </div>
    )
}

export default UserDetail
