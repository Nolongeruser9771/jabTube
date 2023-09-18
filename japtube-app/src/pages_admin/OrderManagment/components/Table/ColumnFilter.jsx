import React from 'react'

export default ColumnFilter = ({ column, table }) => {
    const { filterValue, setFilterValue } = column
    return (
        <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
            <option value="">Select Status</option>
            {column.original.status.map((status, index) => {
                return (
                    <option value={status} key={index}>
                        {status}
                    </option>
                )
            })}
        </select>
    )
}
