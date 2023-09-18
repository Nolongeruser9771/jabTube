import { useMemo, useState, useEffect } from 'react'
import Table from './components/Table'
import { DateTime } from 'luxon'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import authHeader from '../../service/authHeader'
import { useContext } from 'react'
import UserContext from '../../context/UserContext/UserContext'

const API_URL = 'http://localhost:8080'

function OrderManagement() {
    const [data, setData] = useState([])

    const columns = useMemo(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
            },
            {
                header: 'Package Type',
                accessorKey: 'packages.type',
                cell: (info) =>
                    info.getValue() === 'basic' ? (
                        <span
                            style={{
                                backgroundColor: 'rgba(60, 179, 113, 0.55)',
                                padding: '5px 10px',
                                marginRight: '3px',
                                borderRadius: '10px',
                            }}
                        >
                            {info.getValue()}
                        </span>
                    ) : (
                        <span
                            style={{
                                backgroundColor: 'rgba(241, 148, 138, 0.65)',
                                padding: '5px 10px',
                                marginRight: '3px',
                                borderRadius: '10px',
                            }}
                        >
                            {info.getValue()}
                        </span>
                    ),
            },
            {
                header: 'Price',
                accessorKey: 'packages.price',
                cell: (info) => (
                    <span>
                        {info
                            .getValue()
                            .toFixed(0)
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND'}
                    </span>
                ),
            },
            {
                header: 'User Email',
                accessorKey: 'userEmail',
            },
            {
                header: 'Ordered at',
                accessorKey: 'updatedAt',
                cell: (info) => DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (info) =>
                    info.getValue() === 1 ? (
                        <span
                            style={{
                                backgroundColor: 'rgba(60, 179, 113, 0.55)',
                                padding: '5px 10px',
                                marginRight: '3px',
                                borderRadius: '10px',
                            }}
                        >
                            Thành công
                        </span>
                    ) : info.getValue() === 0 ? (
                        <span
                            style={{
                                backgroundColor: 'rgb(249, 231, 159)',
                                padding: '5px 10px',
                                marginRight: '3px',
                                borderRadius: '10px',
                            }}
                        >
                            Đang chờ
                        </span>
                    ) : (
                        <span
                            style={{
                                backgroundColor: 'rgb(241, 148, 138)',
                                padding: '5px 10px',
                                marginRight: '3px',
                                borderRadius: '10px',
                            }}
                        >
                            Thất bại
                        </span>
                    ),
            },
        ],
        []
    )

    useEffect(() => {
        try {
            ;(async () => {
                const result = await fetch(API_URL + '/api/v1/admin/orders', {
                    headers: authHeader(),
                })
                const res = await result.json()
                setData(res)
            })()
        } catch (error) {
            console.log(error)
        }
    }, [])

    //duyệt order
    const { auth } = useContext(UserContext)
    const orderConfirmHandle = async (orderId) => {
        toast.warning('Please wait...', {
            autoClose: 2500,
        })
        try {
            const orderFetch = await fetch(API_URL + `/api/v1/admin/orders/confirm?orderId=${orderId}`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + auth.jwtToken,
                    'Content-Type': 'application/json; charset=utf-8',
                },
            })
            const res = await orderFetch.json()

            if (!res.message) {
                toast.success('Duyệt order thành công!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                })
                //update data
                setData(
                    data.map((order) => {
                        if (order.id === orderId) {
                            return { ...order, status: 1 }
                        }
                        return order
                    })
                )
                console.log('data')
                console.log(data)
                console.log(res)
            } else {
                toast.error('Duyệt không thành công. Order đã duyệt hoặc bị hủy!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Table columns={columns} data={data} orderConfirmHandle={orderConfirmHandle}></Table>
            <ToastContainer />
        </>
    )
}

export default OrderManagement
