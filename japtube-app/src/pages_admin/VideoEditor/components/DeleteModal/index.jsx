import classNames from 'classnames/bind'
import styles from './UploadModal.module.scss'
import { Modal, Box, Button } from '@mui/material'
import { toast } from 'react-toastify'
import authHeader from '../../../../service/authHeader'
const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function DeleteModal({
    handleDeleteModalClose,
    deleteModalOpen,
    videoId,
    setJabSubBlobUrl,
    setVietSubBlobUrl,
    setIsJapSubExist,
    setIsVietSubExist,
    lang,
}) {
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

    //delete sub file
    const subtitleDeleteHandle = async () => {
        try {
            const deleteFetch = await fetch(API_URL + `/api/v1/admin/subtitles?videoId=${videoId}&lang=${lang}`, {
                method: 'DELETE',
                headers: authHeader(),
            })
            const res = await deleteFetch.json()
            if (res.status === 'OK') {
                if (lang === 'vi') {
                    setVietSubBlobUrl(null)
                    setIsVietSubExist(false)
                }
                if (lang === 'jp') {
                    setJabSubBlobUrl(null)
                    setIsJapSubExist(false)
                }
                handleDeleteModalClose()
                toast.success('Đã xóa subtitle ' + lang + ' thành công!', {
                    autoClose: 1000,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Modal
            open={deleteModalOpen}
            onClose={handleDeleteModalClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ ...style, width: 400 }}>
                <h3 id="parent-modal-title">Xoá tệp Phụ đề</h3>
                <p id="parent-modal-description">Bạn chắc chắn muốn xóa tệp phụ đề này?</p>

                <div style={{ display: 'flex', justifyContent: 'right' }}>
                    <Button style={{ fontSize: '1.6rem' }} onClick={handleDeleteModalClose}>
                        Hủy
                    </Button>
                    <Button style={{ fontSize: '1.6rem' }} onClick={() => subtitleDeleteHandle()}>
                        Xóa
                    </Button>
                </div>
            </Box>
        </Modal>
    )
}
