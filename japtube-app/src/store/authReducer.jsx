import secureLocalStorage from 'react-secure-storage'
import { SET_AUTH, UPDATE_AUTH } from './constant'

//1. Tạo state
export const initAuth = secureLocalStorage.getItem('thisAuth') || null

//2. Tạo reducer
const authReducer = (state, action) => {
    console.log('authReducer :', action)

    let newState = null
    switch (action.type) {
        case UPDATE_AUTH: {
            newState = { ...state, ...action.payload }
            break
        }
        case SET_AUTH: {
            newState = { ...action.payload }
            break
        }
        default: {
            newState = state
            break
        }
    }

    //set lại thông tin user vào local storage
    secureLocalStorage.setItem('thisAuth', newState)
    return newState
}

export default authReducer
