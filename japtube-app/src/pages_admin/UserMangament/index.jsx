import { useMemo, useState, useEffect } from 'react'
import Table from './components/Table'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaCirclePlus } from 'react-icons/fa6'
import { Modal, Box, Button } from '@mui/material'
import authHeader from '../../service/authHeader'

const API_URL = 'http://localhost:8080'

function UserMangament() {
    const [data, setData] = useState([])

    const columns = useMemo(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
            },
            {
                header: 'Username',
                accessorKey: 'username',
            },
            {
                header: 'User Email',
                accessorKey: 'email',
            },
            {
                header: 'Vip Member',
                accessorKey: 'vipActive',
                cell: (info) =>
                    info.getValue() ? (
                        <span
                            style={{
                                backgroundColor: 'rgb(245, 183, 177)',
                                padding: '5px 10px',
                                marginRight: '3px',
                                borderRadius: '10px',
                            }}
                        >
                            Vip User
                        </span>
                    ) : !info.getValue() ? (
                        <span
                            style={{
                                backgroundColor: 'rgb(213, 245, 227)',
                                padding: '5px 10px',
                                marginRight: '3px',
                                borderRadius: '10px',
                            }}
                        >
                            Normal User
                        </span>
                    ) : (
                        <></>
                    ),
            },
            {
                header: 'Add Admin',
                cell: ({ row }) => <FaCirclePlus onClick={() => handleOpen(row)} />,
            },
        ],
        []
    )

    //-----------------check page to display button + Modal to add admin--------------------

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

    const [addUserId, setAddUserId] = useState()
    const [open, setOpen] = useState(false)
    const handleOpen = (row) => {
        setOpen(true)
        setAddUserId(row.original.id)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const onAddAdminHandle = async () => {
        if (addUserId) {
            const addAdminFetch = await fetch(API_URL + `/api/v1/admin/users/add-role?userId=${addUserId}`, {
                method: 'PUT',
                headers: authHeader()
            })
            const res = await addAdminFetch.json()
            if (!res.message) {
                setData(data.filter((user) => user.id !== addUserId))
                handleClose()
                toast.success('Thêm quản trị viên thành công', {
                    autoClose: 500,
                })
            } else {
                console.log(res.message)
            }
        }
    }

    useEffect(() => {
        ;(async () => {
            try {
                const result = await fetch(API_URL + '/api/v1/admin/users/search-not-contain?role=admin', {
                    headers: authHeader()
                })
                const res = await result.json()
                !res.message ? setData(res) : setData([])
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h3 id="parent-modal-title">Thêm quản trị viên</h3>
                    <p id="parent-modal-description">Bạn chắc chắn muốn thêm user này làm quản trị viên?</p>
                    <div style={{ display: 'flex', justifyContent: 'right' }}>
                        <Button style={{ fontSize: '1.6rem' }} onClick={handleClose}>
                            Hủy
                        </Button>
                        <Button style={{ fontSize: '1.6rem' }} onClick={() => onAddAdminHandle()}>
                            Xác nhận
                        </Button>
                    </div>
                </Box>
            </Modal>
            <Table columns={columns} data={data}></Table>
            <ToastContainer />
        </>
    )
}

export default UserMangament
