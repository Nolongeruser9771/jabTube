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
import { BsFillTrashFill, BsPencilFill } from 'react-icons/bs'
import { FaCirclePlus } from 'react-icons/fa6'
import { Modal, Box, Button, Input } from '@mui/material'
import { toast } from 'react-toastify'
import { CSVLink } from 'react-csv'
import authHeader from '../../../../service/authHeader'

const cx = classNames.bind(styles)

const API_URL = 'http://localhost:8080'

function Table({ columns, data, updateData }) {
    const [sorting, setSorting] = useState([])
    const [filtering, setFiltering] = useState('')
    const [rowSelection, setRowSelection] = useState({})
    const [columnFilters, setColumnFilters] = useState([])

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
    //-----------------------------------------------delete--------------------------------------------------------
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

    const [deleteCate, setDeleteCate] = useState(null)
    const [open, setOpen] = useState(false)
    const handleOpen = (row) => {
        setOpen(true)
        setDeleteCate(row)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const onDeleteHandle = async () => {
        console.log(deleteCate.id)
        try {
            const deleteCategory = async () => {
                const categoryFetch = await fetch(API_URL + `/api/v1/admin/categories?categoryId=${deleteCate.id}`, {
                    method: 'DELETE',
                    headers: authHeader(),
                })
                const res = await categoryFetch.json()
                console.log(res)

                if (res.status === 'OK') {
                    toast.success('Đã xóa thành công!', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                    })
                    updateData(data.filter((cate) => cate.id !== deleteCate.id))
                    setDeleteCate(null)
                } else {
                    toast.error('Xoá category thất bại.', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                    })
                }
            }
            deleteCategory()
            setOpen(false)
        } catch (error) {
            console.log(error)
        }
    }

    //-----------------------------------------------update--------------------------------------------------------
    const [editCate, setEditCate] = useState(null)
    const [editOpen, setEditOpen] = useState(false)
    const [name, setName] = useState()
    const handleEditOpen = (row) => {
        setEditOpen(true)
        setEditCate(row)
    }
    const handleEditClose = () => {
        setEditOpen(false)
    }

    const onEditHandle = async () => {
        console.log(editCate.id)
        if ((name !== null) & (name !== '') & (name !== undefined)) {
            try {
                const editCategory = async () => {
                    const categoryFetch = await fetch(
                        API_URL + `/api/v1/admin/categories?categoryId=${editCate.id}&name=${name}`,
                        {
                            method: 'PUT',
                            headers: authHeader(),
                        }
                    )
                    const res = await categoryFetch.json()
                    console.log(res)

                    if (!res.message) {
                        toast.success('Lưu thay đổi thành công!', {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 1000,
                        })
                        updateData(
                            data.map((cate) => {
                                if (cate.id === editCate.id) {
                                    return { ...cate, name: name }
                                }
                                return cate
                            })
                        )

                        setEditCate(null)
                    } else {
                        toast.error('Lưu thay đổi thất bại. Danh mục trùng tên hoặc không tồn tại!', {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 1000,
                        })
                    }
                }
                editCategory()
                setEditOpen(false)
            } catch (error) {
                console.log(error)
            }
        }
    }

    //-----------------------------------------------create--------------------------------------------------------
    const [createOpen, setCreateOpen] = useState(false)
    const [cateName, setCateName] = useState()
    const handleCreateOpen = () => {
        setCreateOpen(true)
    }
    const handleCreateClose = () => {
        setCreateOpen(false)
    }

    const onCreateHandle = () => {
        if ((cateName !== undefined) & (cateName !== null) & (cateName !== '')) {
            try {
                const editCategory = async () => {
                    const categoryFetch = await fetch(API_URL + `/api/v1/admin/categories?name=${cateName}`, {
                        method: 'POST',
                        headers: authHeader(),
                    })
                    const res = await categoryFetch.json()
                    console.log(res)

                    if (!res.message) {
                        toast.success('Tạo danh mục thành công!', {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 1000,
                        })
                        updateData([...data, res])
                    } else {
                        toast.error('Tạo danh mục thất bại. Danh mục trùng tên hoặc không tồn tại!', {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 1000,
                        })
                    }
                }
                editCategory()
                setCreateOpen(false)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const [data4Download, setData4Download] = useState([])
    const download = () => {
        let downloadData = []
        let headers = columns.map((col) => col.header)
        downloadData.push(headers)
        table
            .getRowModel()
            .rows.map((row) => downloadData.push([row.original.id, row.original.name, row.original.used]))
        setData4Download(downloadData)
    }

    return (
        <div className={cx('table-wrapper')}>
            {/* Modal */}
            {/* delete */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h3 id="parent-modal-title">Xác nhận xóa Danh mục</h3>
                    {deleteCate ? (
                        deleteCate.used > 0 ? (
                            <>
                                <p>
                                    Danh mục này đang được áp dụng vào <b>{deleteCate.used} phim</b>. Bạn không thể xóa!
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'right' }}>
                                    <Button style={{ fontSize: '1.6rem' }} onClick={handleClose}>
                                        Hủy
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p id="parent-modal-description">Bạn chắc chắn muốn xóa danh mục này?</p>
                                <div style={{ display: 'flex', justifyContent: 'right' }}>
                                    <Button style={{ fontSize: '1.6rem' }} onClick={handleClose}>
                                        Hủy
                                    </Button>
                                    <Button style={{ fontSize: '1.6rem' }} onClick={() => onDeleteHandle()}>
                                        Xóa
                                    </Button>
                                </div>
                            </>
                        )
                    ) : (
                        <></>
                    )}
                </Box>
            </Modal>

            {/* edit */}
            <Modal
                open={editOpen}
                onClose={handleEditClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h3 id="parent-modal-title">Chỉnh sửa Danh mục</h3>
                    <>
                        <p id="parent-modal-description">Tên danh mục</p>
                        <Input
                            style={{ width: '100%', fontSize: '1.6rem' }}
                            defaultValue={editCate ? editCate.name : ''}
                            type="text"
                            placeholder="Enter new category name..."
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'right' }}>
                            <Button style={{ fontSize: '1.6rem' }} onClick={handleEditClose}>
                                Hủy
                            </Button>
                            <Button style={{ fontSize: '1.6rem' }} onClick={() => onEditHandle()}>
                                Lưu
                            </Button>
                        </div>
                    </>
                </Box>
            </Modal>

            {/* create */}
            <Modal
                open={createOpen}
                onClose={handleCreateClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h3 id="parent-modal-title">Thêm Danh mục</h3>
                    <>
                        <p id="parent-modal-description">Tên danh mục</p>
                        <Input
                            style={{ width: '100%', fontSize: '1.6rem' }}
                            type="text"
                            placeholder="Enter new category name..."
                            onChange={(e) => setCateName(e.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'right' }}>
                            <Button style={{ fontSize: '1.6rem' }} onClick={handleCreateClose}>
                                Hủy
                            </Button>
                            <Button style={{ fontSize: '1.6rem' }} onClick={() => onCreateHandle()}>
                                Lưu
                            </Button>
                        </div>
                    </>
                </Box>
            </Modal>

            <div className={cx('order-confirm-wrapper')}>
                <div>
                    <button>
                        <CSVLink data={data4Download} onClick={() => download()}>
                            Export Excel
                        </CSVLink>
                    </button>{' '}
                    <span>Tổng cộng: {data.length} categories</span>
                    <span>
                        <FaCirclePlus onClick={handleCreateOpen} />
                    </span>
                </div>

                <input
                    id={cx('orders-search-box')}
                    placeholder="Enter user email to search..."
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
                            <th>Delete</th>
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            ))}

                            <td onClick={() => handleEditOpen(row.original)}>
                                <BsPencilFill />
                            </td>

                            <td onClick={() => handleOpen(row.original)}>
                                <BsFillTrashFill />
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
