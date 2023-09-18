import classNames from 'classnames/bind'
import styles from './Level.module.scss'
import { useEffect, useState } from 'react'
const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function Level({ level }) {
    const [levelStyle, setLevelStyle] = useState();
    useEffect(() => {
        if(level==="N1" || level==="N2"){
            setLevelStyle({backgroundColor: "rgb(183, 46, 46)"})
        } else if (level==="N3"){
            setLevelStyle({backgroundColor: "rgb(72, 132, 192)"})
        } else {
            setLevelStyle({backgroundColor: "rgb(69, 212, 186)"})
        }
    },[level])
    return (
        <div style={levelStyle} className={cx('level')}>
            <span alt="">{level}</span>
        </div>
    )
}
