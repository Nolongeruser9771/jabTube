import styles from './Packages.module.scss'
import classNames from 'classnames/bind'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserContext from '../../context/UserContext/UserContext'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'
import { updateProfile } from '../../store/action'
import Modal from './components/Modal'

const cx = classNames.bind(styles)
const API_URL = 'http://localhost:8080'

export default function Packages() {
    const { user, dispatchUser } = useContext(UserContext)
    const [display, setdisplay] = useState()
    const navigate = useNavigate()
    const [packagePrice, setPackagePrice] = useState()
    const [packageId, setPackageId] = useState()

    console.log(user)

    const displayHandle = (price, id) => {
        //check hạn dùng package
        if (user) {
            if (user.vipActive) {
                toast.error(
                    'Gói kích hoạt của bạn vẫn đang trong thời gian sử dụng. Hãy quay lại khi muốn gia hạn tiếp nhé!',
                    {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    }
                )
                setTimeout(() => {
                    navigate('/')
                }, 4000)
            } else {
                setPackagePrice(price)
                setPackageId(id)
                setdisplay(!display)
            }
        } else {
            //notify
            toast.error('Bạn cần đăng nhập trước khi thực hiện chức năng này!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            })

            setTimeout(() => {
                navigate('/login')
            }, 2500)
        }
    }

    const freeUserClickHandle = () => {
        console.log(user)
        if (user) {
            navigate(-1)
        } else {
            //notify
            toast.warning('Đăng nhập hoặc đăng kí thành viên để lưu lại những bộ phim yêu thích!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2500,
            })

            setTimeout(() => {
                navigate('/login')
            }, 3000)
        }
    }

    //create order
    const createOrderHandle = () => {
        try {
            const createOrder = async () => {
                const ordreFetch = await fetch(
                    API_URL + `/api/v1/orders/create?userId=${user.id}&packageId=${packageId}`,
                    {
                        method: 'POST',
                    }
                )
                const res = await ordreFetch.json()

                if (!res.message) {
                    console.log(res)
                    toast.success(
                        'Bạn đã đặt mua gói kích hoạt thành công. Vui lòng gửi thông tin chuyển khoản về liên hệ của chúng tôi để được hỗ trợ kích hoạt ngay',
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 4000,
                        }
                    )
                } else {
                    toast.error(res.message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    })
                }
                setdisplay(!display)

                setTimeout(() => {
                    navigate('/')
                }, 4000)
            }
            createOrder()
        } catch (error) {
            console.log(error)
        }
    }

    //kiểm tra thông báo => set lai user
    useEffect(() => {
        if (user) {
            try {
                const updateUserVipActive = async () => {
                    const userFetch = await fetch(API_URL + `/api/v1/users/${user.id}`)
                    const res = await userFetch.json()

                    console.log(res)
                    if (!res.message) {
                        dispatchUser(updateProfile({ vipActive: res.vipActive }))
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

    return (
        <div className={cx('container mt-3')} id={cx('package-container')}>
            {/* Free Package */}
            <div className={cx('package')} id={cx('free-package')}>
                <div className={cx('package__item')}>
                    <div className={cx('package__header')}>
                        <div className={cx('package__name')}>FREE USER</div>
                    </div>
                    <div className={cx('package__body')}>
                        <div className={cx('package__price-container')}>
                            <div className={cx('package__price')}>0.00 VNĐ</div>
                        </div>
                        <ul>
                            <li>Xem các bộ phim miễn phí với phụ đề Việt - Nhật</li>
                            <li>Lưu lại các bộ phim yêu thích</li>
                            <li>Tra từ vựng khi xem phim</li>
                        </ul>
                    </div>
                    <div className={cx('package__footer')} onClick={freeUserClickHandle}>
                        <button>Get Continued</button>
                    </div>
                </div>

                {/* Basic Package */}
                <div className={cx('package__item')} id={cx('basic-package')}>
                    <div className={cx('package__header')}>
                        <div className={cx('package__name')}>PREMIUM USER</div>
                    </div>
                    <div className={cx('package__body')}>
                        <div className={cx('package__price-container')}>
                            <div className={cx('package__price')}>150.000 VNĐ</div>
                            <span>/1 Năm</span>
                        </div>
                        <ul>
                            <li>Xem tất cả các bộ phim với phụ đề Việt - Nhật</li>
                            <li>Lưu lại các bộ phim yêu thích</li>
                            <li>Tra từ vựng khi xem phim</li>

                            <li className={cx('package__price--ins-yearly')}>
                                Tạo đoạn cắt từ bộ phim yêu thích
                                <br />
                            </li>
                            <br />
                            <li>Lưu các đoạn cắt thành playlist riêng của bạn</li>
                        </ul>
                    </div>
                    <div to={'/login'} className={cx('package__footer')}>
                        <button onClick={() => displayHandle('150.000 VNĐ', 2)}>Get Started</button>
                    </div>
                </div>

                {/* Premium Package */}
                <div className={cx('package__item')} id={cx('premium-package')}>
                    <div className={cx('package__header')}>
                        <div className={cx('package__name')}>PRO USER</div>
                    </div>
                    <div className={cx('package__body')}>
                        <div className={cx('package__price-container')}>
                            <div className={cx('package__price')}>99.000 VNĐ</div>
                            <span>/6 Tháng</span>
                        </div>
                        <ul>
                            <li>Xem tất cả các bộ phim với phụ đề Việt - Nhật</li>
                            <li>Lưu lại các bộ phim yêu thích</li>
                            <li>Tra từ vựng khi xem phim</li>

                            <li className={cx('package__price--ins-yearly')}>
                                Tạo đoạn cắt từ bộ phim yêu thích
                                <br />
                            </li>
                            <br />
                            <li>Lưu các đoạn cắt thành playlist riêng của bạn</li>
                        </ul>
                    </div>
                    <div className={cx('package__footer')}>
                        <button onClick={() => displayHandle('99.000 VNĐ', 1)}>Get Started</button>
                    </div>
                </div>
            </div>

            {/* payment pops up */}
            {display ? (
                <div className={cx('modal')}>
                    <article className={cx('modal-container')}>
                        <header className={cx('modal-container-header')}>
                            <h1 className={cx('modal-container-title')}>Hướng dẫn thanh toán</h1>
                            <button className={cx('icon-button')} onClick={displayHandle}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="none" d="M0 0h24v24H0z" />
                                    <path
                                        fill="currentColor"
                                        d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
                                    />
                                </svg>
                            </button>
                        </header>
                        <section className={cx('modal-container-body', 'rtf')}>
                            <h2>Bước 1: </h2>

                            <p>
                                <b>Chuyển khoản đến: </b> <br />
                                Tên người nhận: XX XX XX <br />
                                Ngân hàng: Vietcombank Chi nhánh: XXX - Hà Nội <br />
                                Số tài khoản: XXX-XX-XXX-XXX <br />
                                Nội dung:{' '}
                                <b>
                                    {user ? user.email : ''} - package {packageId}
                                </b>{' '}
                                <br />
                                Phí thanh toán: <b>{packagePrice}</b>{' '}
                            </p>

                            <h2>Bước 2: </h2>

                            <p>
                                Chụp hóa đơn chuyển khoản thanh toán thành công <br />
                                Bấm xác nhận đã thanh toán, gửi hóa đơn vào tin nhắn https://facebook.com/XXX để hỗ trợ
                                kích hoạt ngay{' '}
                            </p>
                            <br />
                        </section>
                        <footer className={cx('modal-container-footer')}>
                            <div className={cx('button', 'is-ghost')} onClick={displayHandle}>
                                Huỷ bỏ
                            </div>
                            <div className={cx('button', 'is-primary')} onClick={() => createOrderHandle()}>
                                Xác nhận thanh toán
                            </div>
                        </footer>
                    </article>
                </div>
            ) : (
                <></>
            )}
            <ToastContainer />
        </div>
    )
}
