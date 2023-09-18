import { useMemo, useState, useEffect, useRef, useContext } from 'react'
import classNames from 'classnames/bind'
import styles from './VideoEditor.module.scss'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DeleteModal from './components/DeleteModal'
import { useNavigate, useParams } from 'react-router-dom'
import UploadModal from './components/UploadModal'
import { BiCheckCircle } from 'react-icons/bi'
import FilmPlayContext from '../../context/PlayFilmContext/FilmPlayContext'
import authHeader from '../../service/authHeader'
import UserContext from '../../context/UserContext/UserContext'

const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function VideoEditor() {
    const navigate = useNavigate()

    const [videoData, setVideoData] = useState([])
    const { videoId } = useParams()

    // -------------------------upload modal-----------------------------------
    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    // -------------------------subdelete modal---------------------------------
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [lang, setLang] = useState()
    const handleDeleteModalOpen = (lang) => {
        setDeleteModalOpen(true)
        setLang(lang)
    }
    const handleDeleteModalClose = (lang) => {
        setDeleteModalOpen(false)
        setLang(lang)
    }

    // -------------------------thumbnail image---------------------------------
    const [imageUrl, setImageUrl] = useState(
        'https://www.keytechinc.com/wp-content/uploads/2022/01/video-thumbnail.jpg'
    )

    useEffect(() => {
        const getThumbnail = async () => {
            if (Object.keys(videoData).length !== 0) {
                try {
                    const thumbnailFetch = await fetch(API_URL + videoData.thumbnail)
                    const blob = await thumbnailFetch.blob()
                    let thumbnailUrl = URL.createObjectURL(blob)

                    console.log(thumbnailUrl)
                    setImageUrl(thumbnailUrl)
                } catch (error) {
                    console.log(error)
                }
            }
        }
        getThumbnail()
    }, [videoData])

    //img change
    const [selectedThumbnail, setSelectedThumbnail] = useState()
    const thumbnailChangeHandle = (e) => {
        if (e.target.files[0]) {
            setSelectedThumbnail(e.target.files[0])
            setImageUrl(URL.createObjectURL(e.target.files[0]))
        }
    }

    const [thumbnailUrl, setThumbnailUrl] = useState()

    const postThumbnail = async () => {
        if (selectedThumbnail.type !== 'image/jpeg' && selectedThumbnail.type !== 'image/png') {
            toast.error('Định dạng ảnh không phù hợp. Xin tải ảnh png/jpg!', {
                autoClose: 1000,
            })
            return
        }

        if (selectedThumbnail !== null) {
            console.log('selectedFile', selectedThumbnail)

            const formData = new FormData()
            formData.append('file', selectedThumbnail)

            try {
                const thumbnailFetch = await fetch(API_URL + `/api/v1/admin/images/thumbnail/post`, {
                    method: 'POST',
                    headers: authHeader(),
                    body: formData,
                })
                const res = await thumbnailFetch.json()
                if (res.status === 'OK') {
                    setThumbnailUrl(res.data)
                    toast.success('Tải ảnh thành công', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                    })
                } else {
                    setImageUrl('https://www.keytechinc.com/wp-content/uploads/2022/01/video-thumbnail.jpg')
                    toast.error('Tải ảnh thất bại. Ảnh không đúng định dạng hoặc kích thước quá lớn', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    // -------------------------subtile-------------------------------
    const [vietSubBlobUrl, setVietSubBlobUrl] = useState()
    const [jabSubBlobUrl, setJabSubBlobUrl] = useState()
    const [isVietSubExist, setIsVietSubExist] = useState()
    const [isJapSubExist, setIsJapSubExist] = useState()

    //get subtitle
    //get jap sub
    const getJapSub = async () => {
        if (videoId) {
            try {
                const videoFetch = await fetch(API_URL + `/api/v1/subtitles/read?videoId=${videoId}&lang=jp`)
                let res = await videoFetch.blob()
                let url = URL.createObjectURL(res)
                setJabSubBlobUrl(url)
            } catch (error) {
                console.log(error)
            }
        }
    }

    //get viet sub
    const getVietSub = async () => {
        if (videoId) {
            try {
                const videoFetch = await fetch(API_URL + `/api/v1/subtitles/read?videoId=${videoId}&lang=vi`)
                const res = await videoFetch.blob()
                let url = URL.createObjectURL(res)
                setVietSubBlobUrl(url)
            } catch (error) {
                console.log(error)
            }
        }
    }

    //subFileChange
    const [selectedSubtitle, setSelectedSubtitle] = useState({ file: null, lang: '' })
    const subChangeHandle = (e, lang) => {
        let splitString = e.target.files[0].name.split('.')
        let type = splitString[splitString.length - 1]

        if (type !== 'vtt') {
            toast.error('Định dạng file không phù hợp. Hãy tải file sub định dạng .vtt', {
                autoClose: 1000,
            })
            setSelectedSubtitle({ file: null, lang: '' })
            return
        }

        if (e.target.files[0]) {
            setSelectedSubtitle({
                file: e.target.files[0],
                lang: lang,
            })
        }
    }

    //updatesubtitle
    const uploadSubtitle = async () => {
        if ((selectedSubtitle.file !== null) & (selectedSubtitle.lang !== null)) {
            let formData = new FormData()
            formData.append('file', selectedSubtitle.file)
            try {
                const subtitleFetch = await fetch(
                    API_URL + `/api/v1/admin/subtitles/upload?videoId=${videoId}&lang=${selectedSubtitle.lang}`,
                    {
                        method: 'POST',
                        headers: authHeader(),
                        body: formData,
                    }
                )
                const res = await subtitleFetch.json()
                if (res.status === 'OK') {
                    if (selectedSubtitle.lang === 'vi') {
                        setVietSubBlobUrl(URL.createObjectURL(selectedSubtitle.file))
                        setIsVietSubExist(true)
                    }
                    if (selectedSubtitle.lang === 'jp') {
                        setJabSubBlobUrl(URL.createObjectURL(selectedSubtitle.file))
                        setIsJapSubExist(true)
                    }
                    toast.success(`Tải subtitle thành công`, {
                        autoClose: 1000,
                    })
                    console.log(res)
                } else {
                    toast.error(`Tải subtile thất bại. Kiểm tra lại kích thước và định dạng file`, {
                        autoClose: 1000,
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    // -------------------------hook form-------------------------------

    const schema = yup
        .object({
            title: yup.string().required('Tiêu đề không được bỏ trống'),
            episode: yup.number().min(1).required('Số tập phải lớn hơn hoặc bằng 1'),
        })
        .required()
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
    })

    useEffect(() => {
        setValue('title', videoData.tittle)
        setValue('status', videoData.status)
        setValue('episode', videoData.episode)
        setValue('isFree', videoData.isFree)
        setValue(
            'thumbnail',
            videoData
                ? videoData.thumbnail
                : 'https://www.keytechinc.com/wp-content/uploads/2022/01/video-thumbnail.jpg'
        )
    }, [videoData])

    const { auth } = useContext(UserContext)

    const onSubmit = async (data) => {
        try {
            console.log('status', data.status)
            console.log('free', data.isFree)
            const request = {
                title: data.title,
                status: data.status,
                isFree: data.isFree === 'true' ? true : false,
                episode: Number(data.episode),
                thumbnail: thumbnailUrl,
            }
            console.log(request)
            const result = await fetch(API_URL + `/api/v1/admin/videos?videoId=${videoData.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + auth.jwtToken,
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(request),
            })
            const res = await result.json()
            console.log(res)
            if (!res.message) {
                toast.success('Update video thành công!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                })
            } else {
                toast.error('Chỉnh sửa thất bại!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    // -------------------------video data-------------------------------
    useEffect(() => {
        if (videoId) {
            try {
                ;(async () => {
                    const result = await fetch(API_URL + `/api/v1/admin/videos/search?videoId=${videoId}`, {
                        headers: authHeader(),
                    })
                    const res = await result.json()
                    if (!res.message) {
                        setVideoData(res)
                        setIsJapSubExist(res.isJapSubExist)
                        setIsVietSubExist(res.isVietSubExist)
                    }
                    console.log(res)
                })()
            } catch (error) {
                console.log(error)
            }
        }
        getJapSub()
        getVietSub()
        episodeRender()
    }, [videoId])

    //-----------------------film Data to constrain episode------------------------
    const [totalEpEl, setTotalEpEl] = useState()
    const { filmPlay } = useContext(FilmPlayContext)

    const episodeRender = () => {
        let existedEps = []
        if (Object.keys(filmPlay).length !== 0) {
            existedEps = filmPlay.videoPublics.map((video) => video.episode)
            const totalEp = []
            let ep = 1
            while (ep <= filmPlay.totalEpisode) {
                if (existedEps.includes(ep)) {
                    console.log(ep)
                    totalEp.push({ episode: ep, exist: true })
                } else {
                    totalEp.push({ episode: ep, exist: false })
                }
                ep++
            }
            setTotalEpEl(totalEp)
        }
    }

    // -------------------------video----------------------------------------------
    const [videoBlobUrl, setVideoBlobUrl] = useState()
    const videoRef = useRef(null)

    return (
        <form action="" onSubmit={handleSubmit(onSubmit)}>
            <UploadModal
                handleClose={handleClose}
                open={open}
                url={videoBlobUrl}
                filmId={videoData.filmId}
                videoId={videoId}
                setVideoBlobUrl={setVideoBlobUrl}
            />
            <DeleteModal
                handleDeleteModalClose={handleDeleteModalClose}
                deleteModalOpen={deleteModalOpen}
                videoId={videoId}
                setJabSubBlobUrl={setJabSubBlobUrl}
                setVideoBlobUrl={setVietSubBlobUrl}
                setIsJapSubExist={setIsJapSubExist}
                setIsVietSubExist={setVietSubBlobUrl}
                lang={lang}
            />
            <div className={cx('film-input-container')}>
                <div className={cx('input-left-side')}>
                    <div className={cx('nav-btn')}>
                        <div onClick={() => navigate(-1)}>Quay lại</div>
                        <button type="submit">Lưu</button>
                    </div>
                    <div>
                        <label htmlFor="">Tiêu đề</label>
                        <input type="text" id="title" name="title" {...register('title')} />
                        <p className={cx('text-danger')}>{errors.title?.message}</p>
                    </div>

                    <div>
                        <div className={cx('upload-btn')}>
                            <div>
                                <label onClick={handleOpen} className={cx('thumbnail-upload-btn')}>
                                    <span>Tải video</span>
                                </label>
                            </div>
                        </div>
                        <p>Preview</p>
                        <div>
                            <video
                                width={'100%'}
                                src={
                                    videoBlobUrl
                                        ? URL.createObjectURL(videoBlobUrl)
                                        : API_URL + `/api/v1/admin/videos/preview?videoId=${videoId}`
                                }
                                ref={videoRef}
                                controls
                            >
                                {isJapSubExist ? (
                                    <track src={jabSubBlobUrl} kind="subtitles" srcLang="jp" label="Japanese"></track>
                                ) : (
                                    <></>
                                )}
                                {isVietSubExist ? (
                                    <track
                                        src={vietSubBlobUrl}
                                        kind="subtitles"
                                        srcLang="vi"
                                        label="Vietnamese"
                                    ></track>
                                ) : (
                                    <></>
                                )}
                            </video>
                        </div>
                    </div>
                </div>
                <div className={cx('input-right-side')}>
                    <div>
                        <label htmlFor="">Trạng thái</label>
                        <select {...register('status')}>
                            <option disabled>Chọn trạng thái</option>
                            <option value={true}>Công khai</option>
                            <option value={false}>Riêng tư</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="">Tập số</label>

                        <select {...register('episode')}>
                            {totalEpEl ? (
                                totalEpEl.map((ep) => (
                                    <option value={ep.episode} key={ep.episode} disabled={ep.exist}>
                                        {ep.episode}
                                    </option>
                                ))
                            ) : (
                                <></>
                            )}
                        </select>

                        <p className={cx('text-danger')}>{errors.episode?.message}</p>
                    </div>
                    <div>
                        <label htmlFor="">Vip</label>
                        <select {...register('isFree')}>
                            <option disabled>Chọn Vip</option>
                            <option value={false}>Pro</option>
                            <option value={true}>Free</option>
                        </select>
                    </div>
                    <div className={cx('upload-btn')}>
                        <div>
                            <label className={cx('thumbnail-upload-btn')}>
                                <span onClick={() => uploadSubtitle()}>Tải Sub Nhật</span>
                            </label>
                            {isJapSubExist ? (
                                <>
                                    <span onClick={() => handleDeleteModalOpen('jp')}>Xoá Sub</span>
                                    <BiCheckCircle />
                                </>
                            ) : (
                                <></>
                            )}
                            <input
                                type="file"
                                id={cx('japsub-upload-btn')}
                                onChange={(e) => subChangeHandle(e, 'jp')}
                            />
                        </div>
                        <div>
                            <label className={cx('thumbnail-upload-btn')}>
                                <span onClick={() => uploadSubtitle()}>Tải Sub Việt</span>
                            </label>

                            {isVietSubExist ? (
                                <>
                                    <span onClick={() => handleDeleteModalOpen('vi')}>Xoá Sub</span>
                                    <BiCheckCircle />
                                </>
                            ) : (
                                <></>
                            )}

                            <input
                                type="file"
                                id={cx('vietsub-upload-btn')}
                                onChange={(e) => subChangeHandle(e, 'vi')}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor={cx('thumbnail-upload-btn')}>
                            <img src={imageUrl} />
                        </label>
                        <input
                            type="file"
                            id={cx('thumbnail-upload-btn')}
                            hidden
                            onChange={(e) => thumbnailChangeHandle(e)}
                        />

                        <label className={cx('thumbnail-upload-btn')}>
                            <span onClick={() => postThumbnail()}>Tải hình ảnh</span>
                        </label>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </form>
    )
}
