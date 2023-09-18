import secureLocalStorage from 'react-secure-storage'
import { UPDATE_PROFILE, LOGIN, LOGOUT } from './constant'

//1. Tạo state
export const initUser = secureLocalStorage.getItem('thisUser') || null

//2. Tạo reducer
const userReducer = (state, action) => {
    console.log('userReducer :', action)

    let newState = null
    switch (action.type) {
        case UPDATE_PROFILE: {
            newState = { ...state, ...action.payload }
            break
        }
        case LOGIN: {
            newState = { ...action.payload }
            break
        }
        case LOGOUT: {
            newState = null
            break
        }
        default: {
            newState = state
            break
        }
    }

    //set lại thông tin user vào local storage
    secureLocalStorage.setItem('thisUser', newState)
    return newState
}

export default userReducer
