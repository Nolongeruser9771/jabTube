import { useMemo, useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Table from './components'
import { DateTime } from 'luxon'
import ThumbnailEl from '../FilmDetails/components/ThumbnailEl'
import Level from '../../pages/Home/components/VideoList/components/Level/Level'
import authHeader from '../../service/authHeader'

const API_URL = 'http://localhost:8080'

function FilmManagement() {
    const [data, setData] = useState([])

    const columns = useMemo(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
            },
            {
                header: 'Video',
                cell: ({ row }) => <ThumbnailEl row={row} />,
            },
            {
                header: 'Title',
                accessorKey: 'title',
            },
            {
                header: 'Level',
                cell: ({ row }) => <Level level={row.original.level} />,
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (info) =>
                    info.getValue() ? (
                        <span style={{ color: 'rgb(40, 116, 166)' }}>Công khai</span>
                    ) : (
                        <span style={{ color: 'rgb(205, 97, 85)' }}>Riêng tư</span>
                    ),
            },
            {
                accessorFn: (row) => `${row.videoPublics.length}/${row.totalEpisode}`,
                header: 'Episode',
            },
            {
                header: 'Categories',
                accessorKey: 'categoryPublics',
                cell: (info) =>
                    info.getValue().map((category) => (
                        <>
                            <span
                                key={category.id}
                                style={{
                                    backgroundColor: 'rgba(60, 179, 113, 0.55)',
                                    padding: '5px 10px',
                                    marginRight: '3px',
                                    borderRadius: '10px',
                                    lineHeight: '30px'
                                }}
                            >
                                {category.name}
                            </span>{' '}
                        </>
                    )),
            },
            {
                header: 'Create At',
                accessorKey: 'createdAt',
                cell: (info) => DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED),
            },
            {
                header: 'Update At',
                accessorKey: 'updatedAt',
                cell: (info) => DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED),
            },
            {
                header: 'Lượt likes',
                accessorKey: 'likes',
            },
            {
                header: 'Lượt xem',
                accessorKey: 'totalViews',
            },
        ],
        []
    )

    //fetch image
    useEffect(() => {
        ;(async () => {
            try {
                const result = await fetch(API_URL + '/api/v1/admin/films', {
                    headers: authHeader(),
                })
                const res = await result.json()
                setData(res)
            } catch (error) {
                console.log(error)
            }
        })()
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

export default FilmManagement
