import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
const API_URL = 'http://localhost:8080'
import logo from '../assets/images/logo.png'

export default function AccountVerifySuccess() {
    const accountCreateRequest = secureLocalStorage.getItem('accountCreateRequest')
    const { accountVerifyToken } = useParams()
    const [notify, setNotify] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        const createAccount = async () => {
            const resquest = {
                email: accountCreateRequest.email,
                username: accountCreateRequest.username,
                password: accountCreateRequest.password,
                passwordConfirm: accountCreateRequest.passwordConfirm,
                verifyToken: accountVerifyToken,
            }

            console.log(resquest)
            try {
                const accountCreateFetch = await fetch(API_URL + `/api/v1/users/create-user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify(resquest),
                })
                const res = await accountCreateFetch.json()

                if (!res.message) {
                    setNotify('Bạn đã tạo tài khoản thành công! Vui lòng đăng nhập để tiếp tục trải nghiệm web')
                    setTimeout(() => {
                        navigate('/login')
                    }, 5000)
                    return
                }
                setNotify('Yêu cầu tạo tài khoản thất bại do: ' + res.message)
            } catch (error) {
                console.log(error)
            }
        }
        createAccount()
    }, [])

    return (
        <div style={{ textAlign: 'center' }}>
            <img src={logo} />
            <h1>{notify}</h1>
        </div>
    )
}
