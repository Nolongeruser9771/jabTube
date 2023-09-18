import { useMemo, useState } from 'react'
import classNames from 'classnames/bind'
import styles from './UploadModal.module.scss'
import { Modal, Box, Button } from '@mui/material'
import { toast } from 'react-toastify'
import ReactPlayer from 'react-player'
import { useNavigate } from 'react-router-dom'
import authHeader from '../../../../service/authHeader'
const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function UploadModal({ filmId, handleClose, open }) {
    const navigate = useNavigate()

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

    //upload video
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewFile, setPreviewFile] = useState()
    const [progress, setProgress] = useState(null)

    const handleFileChange = (event) => {
        if (event.target.files[0]) {
            setSelectedFile(event.target.files[0])
            setPreviewFile(URL.createObjectURL(event.target.files[0]))
            console.log(event.target.files[0])
        }
    }

    const uploadFile = async () => {
        //check if the file type is valid
        if (selectedFile.type === 'video/mp4') {
            //post first chunk to validate and get video Id

            const initUpload = await fetch(API_URL + `/api/v1/admin/videos/upload/initUpload?filmId=${filmId}`, {
                method: 'POST',
                headers: authHeader()
            })
            const result = await initUpload.json()
            console.log(result)

            if (!result.message) {
                console.log(result.data)

                const chunkSize = 1024 * 1024 //1MB
                const chunks = []
                const totalChunks = Math.ceil(selectedFile.size / chunkSize)
                let offset = 0

                //list of chunk files
                while (offset < selectedFile.size) {
                    chunks.push(selectedFile.slice(offset, offset + chunkSize))
                    offset += chunkSize
                }

                //upload chunk
                for (let chunkIdex = 0; chunkIdex < totalChunks; chunkIdex++) {
                    const formData = new FormData()
                    formData.append('file', chunks[chunkIdex])

                    const upload = await fetch(
                        API_URL +
                            `/api/v1/admin/videos/upload/chunk?filmId=${filmId}&videoId=${Number(
                                result.data
                            )}&chunkIndex=${chunkIdex}&totalChunks=${totalChunks}`,
                        {
                            method: 'POST',
                            headers: authHeader(),
                            body: formData,
                        }
                    )
                    const res = await upload.json()
                    if (res.status === 'PARTIAL_CONTENT') {
                        setProgress(Math.round((chunkIdex / (totalChunks - 1)) * 100))
                    }

                    if ((chunkIdex === totalChunks - 1) & (res.status === 'OK')) {
                        toast.success('Upload video thành công!', {
                            autoClose: 1000,
                        })
                        setProgress(null)
                        handleClose()

                        setTimeout(() => {
                            navigate(`${result.data}`)
                        }, 2000)
                    }

                    if (res.message) {
                        toast.error('Upload thất bại. Đã có lỗi xảy ra khi upload!', {
                            autoClose: 1000,
                        })
                        console.log(res.message)
                        chunkIdex = totalChunks - 1
                    }
                }
            } else {
                toast.error('Upload thất bại. Đã có lỗi xảy ra khi upload!', {
                    autoClose: 1000,
                })
                console.log(result.message)
            }
        } else {
            toast.error('Định dạng file không phù hợp! Xin tải file định dạng video/mp4!', {
                autoClose: 1000,
            })
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ ...style, width: 400 }}>
                <h3 id="parent-modal-title">Tải video</h3>
                <p id="parent-modal-description">Chọn tệp "video/mp4" bạn muốn tải</p>
                <div className={cx('upload-btn-container')}>
                    <span className={cx('upload-btn')} onClick={() => uploadFile()}>
                        Tải Video
                    </span>

                    <input type="file" className={cx('choose-file-input')} onChange={(e) => handleFileChange(e)} />
                </div>

                {selectedFile ? (
                    <>
                        <p>
                            <b>Preview</b>
                        </p>
                        {progress ? <span>Loading: {progress}% </span> : <></>}
                        <ReactPlayer controls={true} width="100%" height="100%" url={previewFile}></ReactPlayer>
                    </>
                ) : (
                    <></>
                )}

                <div style={{ display: 'flex', justifyContent: 'right' }}>
                    <Button style={{ fontSize: '1.6rem' }} onClick={handleClose}>
                        Hủy
                    </Button>
                </div>
            </Box>
        </Modal>
    )
}
