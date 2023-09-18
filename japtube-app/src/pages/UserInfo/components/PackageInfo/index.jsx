import classNames from 'classnames/bind'
import styles from './PackageInfo.module.scss'
import GridSystem from '../../../../components/GridSystem'
const API_URL = 'http://localhost:8080'
import UserContext from '../../../../context/UserContext/UserContext'
import { useContext, useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { setAuth, updateProfile } from '../../../../store/action'

const cx = classNames.bind(styles, GridSystem)

export default function PackageInfo() {
    const { user, dispatchUser, dispathAuth } = useContext(UserContext)
    const [packages, setPackage] = useState()

    //get Package
    useEffect(() => {
        getPackage()
    }, [user])

    const getPackage = async () => {
        if (user) {
            try {
                const packageFetch = await fetch(API_URL + '/api/v1/packages?userId=' + user.id)
                const res = await packageFetch.json()
                if (!res.message) {
                    setPackage(res)
                    console.log('res', res)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    //kiểm tra thông báo => set lai user
    useEffect(() => {
        if (user) {
            try {
                const updateUserVipActive = async () => {
                    const userFetch = await fetch(API_URL + `/api/v1/users/${user.id}`)
                    const res = await userFetch.json()
                    console.log(res.vipActive)
                    console.log(res)
                    if (!res.message) {
                        dispatchUser(updateProfile({ vipActive: res.vipActive, roles: res.roles }))
                        console.log(user)
                    } else {
                        console.log(res.message)
                    }
                }
                updateUserVipActive()
            } catch (error) {
                console.log(error)
            }
        }
    }, [])

    console.log(user)

    return (
        <div className={cx('user-detail-container')}>
            <div className={cx('user-basic-info')}>
                <div className={cx('row')}>
                    <div className="username col l-5">
                        <label htmlFor="">Gói người dùng: </label>
                    </div>

                    <div className="col l-5">{packages ? packages.package.title : ''}</div>
                </div>
                <div className={cx('row')}>
                    <div className="email col l-5">
                        <label htmlFor="">Loại gói thanh toán: </label>
                    </div>

                    <div className="col l-5">{packages ? packages.package.type : ''}</div>
                </div>
                <div className={cx('row')}>
                    <div className="email col l-5">
                        <label htmlFor="">Trạng thái: </label>
                    </div>

                    <div className="col l-5">{packages ? 'Đang kích hoạt' : ''}</div>
                </div>
                <div className={cx('row')}>
                    <div className="email col l-5">
                        <label htmlFor="">Hiệu lực từ: </label>
                    </div>

                    <div className="col l-8">
                        {packages ? DateTime.fromISO(packages.effectiveDate).toLocaleString(DateTime.DATETIME_MED) : ''}
                    </div>
                </div>
                <div className={cx('row')}>
                    <div className="email col l-5">
                        <label htmlFor="">Hết hạn vào: </label>
                    </div>

                    <div className="col l-5">
                        {packages ? DateTime.fromISO(packages.expiredAt).toLocaleString(DateTime.DATETIME_MED) : ''}
                    </div>
                </div>
            </div>
        </div>
    )
}
