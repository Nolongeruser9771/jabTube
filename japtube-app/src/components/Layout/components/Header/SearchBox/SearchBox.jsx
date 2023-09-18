import classNames from 'classnames/bind'
import styles from './SearchBox.module.scss'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import search from '../../../../../assets/images/search.png'
const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function SearchBox() {
    const [searchValue, setSearchValue] = useState()
    const navigate = useNavigate()

    //handle keydown search
    const handleKeyDown = (e) => {
        if (!searchValue) {
            return
        }
        //truyền user đi
        if (e.key === 'Enter') {
            navigate(`/search/${searchValue}`)
        }
    }
    return (
        <div className={cx('nav-middle')}>
            <div className={cx('search-box')}>
                <input
                    value={searchValue ? searchValue : ''}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    type="text"
                    placeholder="Search"
                />
                <img src={search} />
            </div>
        </div>
    )
}
