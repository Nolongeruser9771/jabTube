import { CHANGE_FILM, LIKE_FILM, UNLIKE_FILM } from './constant'
import secureLocalStorage from 'react-secure-storage'

//1. Tạo state
export const initFilmPlay = secureLocalStorage.getItem('thisFilmPlay') || {}

//2. Tạo reducer
const filmPlayReducer = (state, action) => {
    console.log('filmPlayReducer :', action)

    let newState = {}
    switch (action.type) {
        case LIKE_FILM: {
            newState = { ...state, likes: state.likes + 1 }
            console.log('newState: ', newState)
            break
        }
        case UNLIKE_FILM: {
            newState = { ...state, likes: state.likes - 1 }
            console.log('newState: ', newState)
            break
        }
        case CHANGE_FILM: {
            newState = { ...action.payload }
            console.log('newState: ', newState)
            break
        }
        default: {
            newState = state
            break
        }
    }

    secureLocalStorage.setItem('thisFilmPlay', newState)
    return newState
}

export default filmPlayReducer
