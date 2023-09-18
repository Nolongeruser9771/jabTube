import { CHANGE_VIDEO } from './constant'
import secureLocalStorage from 'react-secure-storage'

//1. Tạo state
export const initVideoPlay = secureLocalStorage.getItem('thisVideoPlay') || {}

//2. Tạo reducer
const videoPlayReducer = (state, action) => {
    console.log('videoPlayReducer :', action)

    let newState = {}
    switch (action.type) {
        case CHANGE_VIDEO: {
            newState = { ...action.payload }
            break
        }
        default: {
            newState = state
            break
        }
    }

    secureLocalStorage.setItem('thisVideoPlay', newState)
    return newState
}

export default videoPlayReducer
