import { useMemo, useState, useEffect } from 'react'
import Table from '../UserMangament/components/Table'
import { AiFillMinusCircle } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Modal, Box, Button } from '@mui/material'
import authHeader from '../../service/authHeader'
const API_URL = 'http://localhost:8080'

function Member() {
    const [data, setData] = useState([])

    const columns = [
        {
            header: 'ID',
            accessorKey: 'id',
        },
        {
            header: 'Avatar',
            accessorKey: 'avatar',
            cell: ({ row }) => <Avatar row={row} />,
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
            cell: (
                <span
                    style={{
                        backgroundColor: 'rgb(232, 218, 239)',
                        padding: '5px 10px',
                        marginRight: '3px',
                        borderRadius: '10px',
                    }}
                >
                    Admin
                </span>
            ),
        },
        {
            header: 'Delete',
            cell: ({ row }) => (
                <span onClick={() => handleOpen({ row })}>
                    <AiFillMinusCircle style={{ width: '20px', height: '20px' }} />
                </span>
            ),
        },
    ]

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

    const [removeUserId, setRemoveUserId] = useState()
    const [open, setOpen] = useState(false)
    const handleOpen = ({ row }) => {
        setOpen(true)
        setRemoveUserId(row.original.id)
        console.log(row.original.id)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const onDeleteHandle = async () => {
        if (removeUserId) {
            const removeAdminFetch = await fetch(API_URL + `/api/v1/admin/users/remove-role?userId=${removeUserId}`, {
                method: 'PUT',
                headers: authHeader()
            })
            const res = await removeAdminFetch.json()
            if (!res.message) {
                setData(data.filter((user) => user.id !== removeUserId))
                handleClose()
                toast.success('Xoá quản trị viên thành công', {
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
                const result = await fetch(API_URL + '/api/v1/admin/users?role=admin', {
                    headers: authHeader()
                })
                const res = await result.json()
                !res.message ? setData(res) : setData([])
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    //get avatar
    const Avatar = ({ row }) => {
        const [apiData, setApiData] = useState(null)

        useEffect(() => {
            const getThumbnail = async () => {
                if (row.original.avatar) {
                    const avatarFetch = await fetch(API_URL + row.original.avatar, {
                        headers: authHeader()
                    })
                    const res = await avatarFetch.blob()
                    const fetchedData = URL.createObjectURL(res)
                    setApiData(fetchedData)
                } else {
                    setApiData('https://i.pinimg.com/564x/18/b9/ff/18b9ffb2a8a791d50213a9d595c4dd52.jpg')
                }
            }
            getThumbnail()
        }, [row.original.id])

        return <img style={{ width: '50px', height: '50px', borderRadius: '50px' }} src={apiData}></img>
    }

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h3 id="parent-modal-title">Hủy chức năng quản trị viên</h3>
                    <p id="parent-modal-description">Bạn chắc chắn muốn hủy chức năng quản trị của member này?</p>
                    <div style={{ display: 'flex', justifyContent: 'right' }}>
                        <Button style={{ fontSize: '1.6rem' }} onClick={handleClose}>
                            Hủy
                        </Button>
                        <Button style={{ fontSize: '1.6rem' }} onClick={() => onDeleteHandle()}>
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

export default Member
