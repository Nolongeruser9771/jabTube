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
import { CSVLink } from 'react-csv'

const cx = classNames.bind(styles)
const API_URL = 'http://localhost:8080'

function Table({ columns, data, orderConfirmHandle }) {
    const [sorting, setSorting] = useState([
        {
            id: 'updatedAt',
            desc: true,
        },
    ])
    const [filtering, setFiltering] = useState()
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
    const download = () => {
        let downloadData = []
        let headers = columns.map((col) => col.header)
        downloadData.push(headers)
        table
            .getRowModel()
            .rows.map((row) =>
                downloadData.push([
                    row.original.id,
                    row.original.packages.type,
                    row.original.packages.price,
                    row.original.userEmail,
                    row.original.updatedAt,
                    row.original.status == 1 ? 'Thành công' : 'Đang chờ',
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
                        {data.reduce((count, order) => (order.status === 0 ? count + 1 : count), 0)}/{data.length}{' '}
                        Orders chưa duyệt
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
                            <th>Confirm</th>
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            ))}
                            <td>
                                {row.original.status === 1 ? (
                                    <button disabled>Duyệt</button>
                                ) : (
                                    <button onClick={() => orderConfirmHandle(row.original.id)}>Duyệt</button>
                                )}
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
