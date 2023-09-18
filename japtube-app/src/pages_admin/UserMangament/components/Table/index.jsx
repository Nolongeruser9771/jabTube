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

const cx = classNames.bind(styles)
const API_URL = 'http://localhost:8080'
import { CSVLink } from 'react-csv'
import { useLocation } from 'react-router-dom'

function Table({ columns, data }) {
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

    //-----------------------download data-----------------------------------
    const [data4Download, setData4Download] = useState([])
    const location = useLocation()
    const download = () => {
        let downloadData = []
        let headers = columns.map((col) => col.header)
        downloadData.push(headers)
        table
            .getRowModel()
            .rows.map((row) =>
                location.pathname.includes('users')
                    ? downloadData.push([
                          row.original.id,
                          row.original.username,
                          row.original.email,
                          row.original.vipActive ? 'vip_user' : 'normal_user',
                      ])
                    : downloadData.push([
                          row.original.id,
                          row.original.avatar,
                          row.original.username,
                          row.original.email,
                          "admin",
                      ])
            )
        setData4Download(downloadData)
    }

    return (
        <div className={cx('table-wrapper')}>
            <div className={cx('order-confirm-wrapper')}>
                <div>
                    <button>
                        <CSVLink data={data4Download} onClick={() => download()}>
                            Export Excel
                        </CSVLink>
                    </button>{' '}
                    <span>
                        {data.reduce((count, user) => (user.vipActive === true ? count + 1 : count), 0)}/{data.length}{' '}
                        Active users
                    </span>
                </div>

                <div>
                    <input
                        id={cx('orders-search-box')}
                        placeholder="Enter keyword to search..."
                        type="text"
                        value={filtering}
                        onChange={(e) => setFiltering(e.target.value)}
                    />
                </div>
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
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            ))}
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
