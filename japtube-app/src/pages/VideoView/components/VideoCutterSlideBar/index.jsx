import classNames from 'classnames/bind'
import styles from './VideoCutterSlideBar.module.scss'
import { Slider } from '@material-ui/core'
import { useState } from 'react'

const API_URL = 'http://localhost:8080'

const cx = classNames.bind(styles)

export default function VideoCutterSlideBar() {
    const [value, setValue] = useState([0, 30])

    const onStartTimeChangeHandle = (event, value) => {
        setValue(value)
    }

    return (
        <>
            <Slider
                id={cx('slider')}
                orientation="horizontal"
                value={value}
                onChange={onStartTimeChangeHandle}
                min={0}
                max={325}
                valueLabelDisplay="on"
                aria-labelledby="non-linear-slider"
            />
        </>
    )
}
