import classNames from 'classnames/bind'
import styles from './DashBoard.module.scss'
import Chart from 'chart.js/auto'
import { Line, Bar } from 'react-chartjs-2'
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6'
import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import authHeader from '../../service/authHeader'
const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

function DashBoard() {
    //-----------------------------call api to get data-------------------------
    const [dashboardData, setDashboardData] = useState()
    useEffect(() => {
        getAllDashBoardData()
        getDashboardDataByYear(2023)
    }, [])

    const getAllDashBoardData = async () => {
        try {
            const dataFetch = await fetch(API_URL + `/api/v1/admin/dashboard`, {
                headers: authHeader(),
            })
            const res = await dataFetch.json()
            if (!res.message) {
                setDashboardData(res)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [selectedMonth, setSelectedMonth] = useState()
    const [selectedYear, setSelectedYear] = useState(DateTime.now().year)
    const [dashboardDataByYear, setDashboardDataByYear] = useState([])
    const [totalRevenue, setTotalRevenue] = useState([1, 2, 3, 4, 5, 6])
    const [totalUsers, setTotalUsers] = useState([1, 2, 3, 4, 5, 6])
    const getDashboardDataByYear = async (year) => {
        setSelectedYear(year)
        try {
            const dataFetch = await fetch(API_URL + `/api/v1/admin/dashboard/search?year=${year}`, {
                headers: authHeader(),
            })
            const res = await dataFetch.json()
            if (!res.message) {
                let totalRev = res.map((mon) => mon.totalRevenue)
                let totalUsers = res.map((mon) => mon.totalUsers)
                setTotalRevenue(totalRev)
                setTotalUsers(totalUsers)
                setDashboardDataByYear(res)
            }
        } catch (error) {
            console.log(error)
        }
    }

    //-----------------------------Total views Users --------------------------------
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const revenueData = {
        labels: labels,
        datasets: [
            {
                label: 'Tổng doanh thu theo tháng',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: totalRevenue ? totalRevenue : [],
            },
        ],
    }

    const usersData = {
        labels: labels,
        datasets: [
            {
                label: 'Tổng users theo tháng',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: totalUsers ? totalUsers : [],
            },
        ],
    }

    const resetFilter = () => {
        getAllDashBoardData()
        setSelectedMonth(null)
        getDashboardDataByYear(DateTime.now().year)
        console.log(DateTime.now().year)
    }

    //--------------------------------data for download--------------------------------------
    const [data4Download, setData4Download] = useState([])
    const download = () => {
        let downloadData = []
        dashboardDataByYear.map((monthlyData) => {
            downloadData.push({
                month: monthlyData.month,
                totalUsers: monthlyData.totalUsers,
                totalRevenue: monthlyData.totalRevenue,
                totalActiveUsers: monthlyData.totalActiveUsers,
                totalOrders: monthlyData.totalOrders,
            })
        })

        downloadData.push({
            month: 'Until ' + moment().toISOString(),
            totalUsers: dashboardData.totalUsers,
            totalRevenue: dashboardData.totalRevenue,
            totalActiveUsers: dashboardData.totalActiveUsers,
            totalOrders: dashboardData.totalOrders,
        })
        setData4Download(downloadData)
    }

    //---------------------------------format number -------------------------------------
    const formatNumber = (num) => {
        var parts = num.toString().split('.')
        const numberPart = parts[0]
        const decimalPart = parts[1]
        const thousands = /\B(?=(\d{3})+(?!\d))/g
        return numberPart.replace(thousands, ',') + (decimalPart ? '.' + decimalPart : '')
    }

    return (
        <>
            <div className={cx('report-chart')}>
                <div className={cx('display-options')}>
                    <div>
                        <span>Hiển thị kết quả cho Tháng: </span>
                        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                            <option defaultValue={null}>--</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                        <span> Năm: </span>
                        <select value={selectedYear} onChange={(e) => getDashboardDataByYear(e.target.value)}>
                            <option defaultValue={null}>--</option>
                            {[2023, 2024, 2025].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => resetFilter()}>Tất cả dữ liệu</button>
                        <button>
                            <CSVLink data={data4Download} onClick={() => download()}>
                                Export Excel
                            </CSVLink>
                        </button>
                    </div>
                </div>
                <div className={cx('kanban')}>
                    <div>
                        Tổng User {selectedMonth ? selectedMonth + '/' + selectedYear : ''}
                        {selectedMonth ? (
                            dashboardDataByYear.map((month) => {
                                if (month.month === Number(selectedMonth)) {
                                    return <div>{formatNumber(month.totalUsers)}</div>
                                }
                            })
                        ) : (
                            <div>{dashboardData ? formatNumber(dashboardData.totalUsers) : ''}</div>
                        )}
                    </div>
                    <div>
                        Active User {selectedMonth ? selectedMonth + '/' + selectedYear : ''}
                        {selectedMonth ? (
                            dashboardDataByYear.map((month) => {
                                if (month.month === Number(selectedMonth)) {
                                    return <div>{formatNumber(month.totalActiveUsers)}</div>
                                }
                            })
                        ) : (
                            <div>{dashboardData ? formatNumber(dashboardData.totalActiveUsers) : ''}</div>
                        )}
                    </div>
                    <div>
                        Tổng Doanh Thu {selectedMonth ? selectedMonth + '/' + selectedYear : ''}
                        {selectedMonth ? (
                            dashboardDataByYear.map((month) => {
                                if (month.month === Number(selectedMonth)) {
                                    return <div>{formatNumber(month.totalRevenue)}</div>
                                }
                            })
                        ) : (
                            <div>{dashboardData ? formatNumber(dashboardData.totalRevenue) : ''}</div>
                        )}
                    </div>
                    <div>
                        Tổng order {selectedMonth ? selectedMonth + '/' + selectedYear : ''}
                        {selectedMonth ? (
                            dashboardDataByYear.map((month) => {
                                if (month.month === Number(selectedMonth)) {
                                    return <div>{formatNumber(month.totalOrders)}</div>
                                }
                            })
                        ) : (
                            <div>{dashboardData ? formatNumber(dashboardData.totalOrders) : ''}</div>
                        )}
                    </div>
                </div>
                <div className={cx('dashboard-chart')}>
                    <div>
                        <span>
                            Tổng số user {selectedYear ? selectedYear : ''}:{' '}
                            {totalUsers ? formatNumber(totalUsers[totalUsers.length - 1]) + ' users' : ''}
                        </span>
                        <hr />
                        <Line data={usersData} />
                    </div>
                    <div>
                        <span>
                            Tổng doanh thu {selectedYear ? selectedYear : ''}:{' '}
                            {totalRevenue
                                ? formatNumber(totalRevenue.reduce((total, revenue) => total + revenue, 0)) + ' VND'
                                : ''}
                        </span>
                        <hr />
                        <Bar data={revenueData} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashBoard
