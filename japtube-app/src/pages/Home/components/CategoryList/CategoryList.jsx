import classNames from 'classnames/bind'
import styles from './CategoryList.module.scss'
import { useEffect, useState } from 'react'
const API_URL = 'http://localhost:8080'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

const cx = classNames.bind(styles)
// onCategoryClick, onGetAllFilmClick, onGetAllPopularFilm

export default function CategoryList({ filmList, filterFilmList }) {
    //get category list by most used
    const [categoryList, setCategoryList] = useState([])
    const style = { backgroundColor: 'black', color: 'white' }
    const [selectedCateId, setSelectedCateId] = useState()

    useEffect(() => {
        const getCategoryList = async () => {
            try {
                const categoryFetch = await fetch(API_URL + '/api/v1/categories/top-categories')
                const res = await categoryFetch.json()
                setCategoryList(res)
            } catch (error) {
                console.log(error)
            }
        }
        getCategoryList()
    }, [])

    const onGetAllFilmClick = () => {
        setSelectedCateId('cate-all')
        filterFilmList(filmList)
    }

    const onGetAllPopularFilm = async () => {
        setSelectedCateId('cate-new')
        try {
            const allPopularFilmFetch = await fetch(API_URL + '/api/v1/films/most-view-films')
            const res = await allPopularFilmFetch.json()
            filterFilmList(res)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    //get film list of a category
    const onCategoryClick = (id) => {
        setSelectedCateId('cate-' + id)
        const getFilmList = async () => {
            try {
                const filmFetch = await fetch(API_URL + '/api/v1/films/most-view-by-category?categoryId=' + id)
                const res = await filmFetch.json()
                console.log(res)
                filterFilmList(res)
            } catch (error) {
                console.log(error)
            }
        }
        getFilmList()
    }

    return (
        <div className={cx('category-container')}>
            <Swiper
                spaceBetween={10}
                slidesPerView={8}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
            >
                <SwiperSlide key={'cate-all'}>
                    <div
                        style={selectedCateId === 'cate-all' ? style : {}}
                        onClick={(id) => onGetAllFilmClick(id)}
                        className={cx('category')}
                    >
                        Tất cả
                    </div>
                </SwiperSlide>
                <SwiperSlide key={'cate-new'}>
                    <div
                        style={selectedCateId === 'cate-new' ? style : {}}
                        onClick={(id) => onGetAllPopularFilm(id)}
                        className={cx('category')}
                    >
                        Phổ biến
                    </div>
                </SwiperSlide>
                {categoryList.map((cate) => (
                    <SwiperSlide key={cate.id}>
                        <div
                            style={selectedCateId === `cate-${cate.id}` ? style : {}}
                            id={'cate-' + cate.id}
                            onClick={() => onCategoryClick(cate.id)}
                            className={cx('category')}
                        >
                            {cate.name}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
