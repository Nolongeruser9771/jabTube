import { useMemo, useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from '../FilmEditor/FilmEditor.module.scss'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MDEditor, { commands, title } from '@uiw/react-md-editor'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import UserContext from '../../context/UserContext/UserContext'
import authHeader from '../../service/authHeader'

const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function FilmCreator() {
    const navigate = useNavigate()
    const levels = [{ value: 'N1' }, { value: 'N2' }, { value: 'N3' }, { value: 'N4' }, { value: 'N5' }]
    const { auth } = useContext(UserContext)

    //get All categories
    const [categoryList, setCategoryList] = useState([])

    useEffect(() => {
        const getCategoryList = async () => {
            try {
                const categoryFetch = await fetch(API_URL + '/api/v1/categories')
                const res = await categoryFetch.json()
                setCategoryList(res)
            } catch (error) {
                console.log(error)
            }
        }
        getCategoryList()
    }, [])

    //image & thumbnail
    const [imageUrl, setImageUrl] = useState(
        'https://www.keytechinc.com/wp-content/uploads/2022/01/video-thumbnail.jpg'
    )

    const [selectedThumbnail, setSelectedThumbnail] = useState()
    const thumbnailChangeHandle = (e) => {
        if (e.target.files[0]) {
            setSelectedThumbnail(e.target.files[0])
            setImageUrl(URL.createObjectURL(e.target.files[0]))
        }
    }

    const [thumbnailUrl, setThumbnailUrl] = useState()

    const postThumbnail = async () => {
        if (
            selectedThumbnail.type !== 'jpg' &&
            selectedThumbnail.type !== 'png' &&
            selectedThumbnail.type !== 'image/jpeg'
        ) {
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

    //hook form

    const schema = yup
        .object({
            title: yup.string().required('Tiêu đề không được bỏ trống'),
            totalEpisode: yup.number().required('Tổng số tập không được bỏ trống và phải là số nguyên'),
        })
        .required()
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
    })

    const onSubmit = async (data) => {
        try {
            const request = {
                title: data.title,
                totalEpisode: Number(data.totalEpisode),
                level: data.level,
                status: data.status,
                categoryIdList: data.categoryIdList.map((cate) => cate.id),
                description: data.description,
                thumbnail: thumbnailUrl,
            }
            console.log(request)
            const result = await fetch(API_URL + `/api/v1/admin/films/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: 'Bearer ' + auth.jwtToken,
                },
                body: JSON.stringify(request),
            })
            const res = await result.json()
            console.log(res)
            if (!res.message) {
                toast.success('Tạo phim thành công!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                })
            } else {
                toast.error('Tạo phim thất bại!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form action="" onSubmit={handleSubmit(onSubmit)}>
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
                        <p>Giới thiệu phim</p>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => {
                                const { onChange, value } = field
                                return <MDEditor value={value} onChange={(val) => onChange(val)} height={340} />
                            }}
                        />
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
                        <label htmlFor="">Danh mục</label>
                        <Controller
                            name="categoryIdList"
                            control={control}
                            render={({ field }) => {
                                const { onChange, value } = field
                                return (
                                    <Select
                                        name={'categoryIdList'}
                                        options={categoryList}
                                        value={value}
                                        onChange={(val) => {
                                            onChange(val)
                                        }}
                                        getOptionValue={(option) => option.id}
                                        getOptionLabel={(option) => option.name}
                                        isMulti
                                    />
                                )
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="">Tổng số tập</label>
                        <input type="text" id="totalEpisode" name="episode" {...register('totalEpisode')} />
                        <p className={cx('text-danger')}>{errors.totalEpisode?.message}</p>
                    </div>
                    <div>
                        <label htmlFor="">Level</label>
                        <select {...register('level')}>
                            <option disabled>Chọn level</option>
                            {levels.map((level, index) => (
                                <option key={index}>{level.value}</option>
                            ))}
                        </select>
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
