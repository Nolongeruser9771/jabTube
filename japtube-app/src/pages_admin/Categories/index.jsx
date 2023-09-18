import { useMemo, useState, useEffect } from 'react'
import Table from './components/Table'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const API_URL = 'http://localhost:8080'

function Categories() {
    const [data, setData] = useState([])

    const columns = useMemo(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => (
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
                ),
            },
            {
                header: 'Total used',
                accessorKey: 'used',
            },
        ],
        []
    )

    useEffect(() => {
        try {
            ;(async () => {
                const result = await fetch(API_URL + '/api/v1/categories')
                const res = await result.json()
                setData(res)
            })()
        } catch (error) {
            console.log(error)
        }
    }, [])

    
    const updateData = (data) => {
        setData(data)
    }

    return (
        <>
            <Table columns={columns} data={data} updateData={updateData}></Table>
            <ToastContainer />
        </>
    )
}

export default Categories
