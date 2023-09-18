import { ADD_FAVORITE, GET_LIST, REMOVE_FAVORITE } from './constant'
import secureLocalStorage from 'react-secure-storage'

//1. Tạo state
export const initLikedFilms = secureLocalStorage.getItem('likedFilmList') || []

//2. Tạo reducer
const likedFilmsReducer = (state, action) => {
    console.log('filmlikedFilmsReducer :', action)

    let newState = []
    switch (action.type) {
        case ADD_FAVORITE: {
            newState = [...state, action.payload]
            console.log('newState: ', newState)
            break
        }
        case REMOVE_FAVORITE: {
            const { id } = action.payload
            newState = state.filter((film) => film.id !== id)
            console.log('newState: ', newState)
            break
        }
        case GET_LIST: {
            newState = action.payload
            console.log('newState: ', newState)
            break
        }
        default: {
            newState = [...state]
            break
        }
    }

    secureLocalStorage.setItem('likedFilmList', newState)
    return newState
}

export default likedFilmsReducer
