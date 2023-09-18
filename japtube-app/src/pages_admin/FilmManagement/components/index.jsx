import styles from './Table.module.scss'
import classNames from 'classnames/bind'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from '@tanstack/react-table'
import { BiTrash } from 'react-icons/bi'
import { FaCirclePlus } from 'react-icons/fa6'
import { Modal, Box, Button } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import { CSVLink } from 'react-csv'
import authHeader from '../../../service/authHeader'

const cx = classNames.bind(styles)
const API_URL = 'http://localhost:8080'

function Table({ columns, data, updateData }) {
    const [sorting, setSorting] = useState([])
    const [filtering, setFiltering] = useState('')
    const [rowSelection, setRowSelection] = useState({})
    const [columnFilters, setColumnFilters] = useState([])
    const navigate = useNavigate()

    //Modal
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 5,
        pt: 2,
        px: 4,
        pb: 3,
    }

    const [deleteFilmId, setDeleteFilmId] = useState()
    const [open, setOpen] = useState(false)
    const handleOpen = (filmId) => {
        setOpen(true)
        setDeleteFilmId(filmId)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting: sorting,
            globalFilter: filtering,
            rowSelection: rowSelection,
            columnFilters: columnFilters,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters,
    })

    //delete film
    const onDeleteHandle = () => {
        console.log(deleteFilmId)
        try {
            const deleteFilm = async () => {
                const filmFetch = await fetch(API_URL + `/api/v1/admin/films?filmId=${deleteFilmId}`, {
                    method: 'DELETE',
                    headers: authHeader()
                })
                const res = await filmFetch.json()
                console.log(res)

                if (res.status === 'OK') {
                    toast.success('Đã xóa thành công!', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                    })
                    updateData(data.filter((film) => film.id !== deleteFilmId))
                } else {
                    toast.error(
                        'Xoá phim thất bại. Phim đã được xem hoặc đang nằm trong danh sách yêu thích của users',
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 1000,
                        }
                    )
                }
            }
            deleteFilm()
            setOpen(false)
        } catch (error) {
            console.log(error)
        }
    }

    //-----------------------download data-----------------------------------
    const [data4Download, setData4Download] = useState([])
    const download = () => {
        let downloadData = []
        let headers = columns.map((col) => col.header)
        downloadData.push(headers)
        table
            .getRowModel()
            .rows.map((row) =>
                downloadData.push([
                    row.original.id,
                    row.original.thumbnail,
                    row.original.title,
                    row.original.level,
                    row.original.status,
                    row.original.videoPublics.length + '/' + row.original.totalEpisode,
                    row.original.categoryPublics.reduce((string, cate) => string + " - " + cate.name, ''),
                    row.original.createdAt,
                    row.original.updatedAt,
                    row.original.likes,
                    row.original.totalViews,
                ])
            )
        setData4Download(downloadData)
    }

    return (
        <div className={cx('table-wrapper')}>
            {/* Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h3 id="parent-modal-title">Xác nhận xóa phim</h3>
                    <p id="parent-modal-description">Bạn chắc chắn muốn xóa phim này?</p>
                    <div style={{ display: 'flex', justifyContent: 'right' }}>
                        <Button style={{ fontSize: '1.6rem' }} onClick={handleClose}>
                            Hủy
                        </Button>
                        <Button style={{ fontSize: '1.6rem' }} onClick={() => onDeleteHandle()}>
                            Xóa
                        </Button>
                    </div>
                </Box>
            </Modal>
            <div className={cx('order-confirm-wrapper')}>
                <div>
                    <button>
                        <CSVLink data={data4Download} onClick={() => download()}>
                            Export Excel
                        </CSVLink>
                    </button>
                    <span style={{ padding: '0px 10px' }}>
                        Tổng số phim: {data.reduce((count) => count + 1, 0)} Phim
                    </span>
                    <span style={{ padding: '0px 20px' }}>
                        <FaCirclePlus onClick={() => navigate('create')} />
                    </span>
                </div>

                <input
                    id={cx('orders-search-box')}
                    placeholder="Enter keyword to search..."
                    type="text"
                    value={filtering}
                    onChange={(e) => setFiltering(e.target.value)}
                />
            </div>

            <table className={cx('orders-table')}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}{' '}
                                    {{ asc: '▲', desc: '▼' }[header.column.getIsSorted() ?? null]}
                                </th>
                            ))}
                            <th>Delete</th>
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td onClick={() => navigate(`${row.original.id}`)} key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                            <td>
                                <BiTrash onClick={() => handleOpen(row.original.id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={cx('table-footer')}>
                <div>
                    <span>
                        You are on page number: {table.options.state.pagination.pageIndex + 1}/{table.getPageCount()}{' '}
                        Pages.
                    </span>
                    <span>
                        Go to page:{' '}
                        <input
                            style={{ backgroundColor: 'white', width: '5%' }}
                            type="number"
                            defaultValue={table.options.state.pagination.pageIndex + 1}
                            onChange={(e) => table.setPageIndex(e.target.value - 1)}
                        />
                    </span>
                    <span>
                        Select page size:
                        <select
                            value={table.options.state.pagination.pageSize}
                            onChange={(e) => table.setPageSize(e.target.value)}
                        >
                            {[3, 5, 10, 15].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                    </span>
                </div>
                <div>
                    <button onClick={() => table.setPageIndex(0)}>First</button>
                    <button disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
                        &lt;&lt;
                    </button>
                    <button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
                        &gt;&gt;
                    </button>
                    <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>Last</button>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Table
