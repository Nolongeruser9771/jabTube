import styles from './Table.module.scss'
import classNames from 'classnames/bind'
import { useState } from 'react'
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
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import UploadModal from '../../../VideoCreator/components/UploadModal'
import authHeader from '../../../../service/authHeader'

const cx = classNames.bind(styles)
const API_URL = 'http://localhost:8080'

function Table({ columns, data, updateData }) {
    const [sorting, setSorting] = useState([])
    const [filtering, setFiltering] = useState('')
    const [rowSelection, setRowSelection] = useState({})
    const [columnFilters, setColumnFilters] = useState([])
    const navigate = useNavigate()

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

    const [deleteVideoId, setdeleteVideoId] = useState()
    const [modalOpen, setModalOpen] = useState(false)
    const handleModalOpen = (videoId) => {
        setModalOpen(true)
        setdeleteVideoId(videoId)
    }
    const handleModalClose = () => {
        setModalOpen(false)
    }

    //delete video
    const onDeleteHandle = () => {
        console.log(deleteVideoId)
        try {
            const deleteVideo = async () => {
                const videoFetch = await fetch(API_URL + `/api/v1/admin/videos?videoId=${deleteVideoId}`, {
                    method: 'DELETE',
                    headers: authHeader()
                })
                const res = await videoFetch.json()
                console.log(res)

                if (res.status === 'OK') {
                    toast.success('Đã xóa thành công!', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                    })
                    updateData(data.filter((video) => video.id !== deleteVideoId))
                    console.log(data)
                } else {
                    toast.error('Xoá video thất bại. Video đang nằm trong danh sách xem của users', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                    })
                }
                setdeleteVideoId(null)
            }
            deleteVideo()
            setModalOpen(false)
        } catch (error) {
            console.log(error)
        }
    }

    //--------------------------------Modal---------------------------------------
    const [open, setOpen] = useState(false)
    const { filmId } = useParams()
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div className={cx('table-wrapper')}>
            {/* Upload */}
            <UploadModal handleClose={handleClose} open={open} filmId={filmId} />

            {/* Modal */}
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h3 id="parent-modal-title">Xác nhận xóa video</h3>
                    <p id="parent-modal-description">Bạn chắc chắn muốn xóa video này?</p>
                    <div style={{ display: 'flex', justifyContent: 'right' }}>
                        <Button style={{ fontSize: '1.6rem' }} onClick={handleModalClose}>
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
                    <span>Tổng số tập đã phát: {data.length} tập</span>
                    <span style={{ padding: '0px 20px', color: 'grey' }}>
                        <FaCirclePlus onClick={handleOpen} />
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
                            <th>Edit</th>
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} onClick={() => navigate(`${row.original.id}`)}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                            <td>
                                <BiTrash onClick={() => handleModalOpen(row.original.id)} />
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
        </div>
    )
}

export default Table
