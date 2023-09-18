import { rewind } from './action'
import { REWIND, GET_TIMESTAMPS } from './constant'

//1. Tạo state
export const initSubtitlePlay = {
    rewind: 0,
    timestamps: [],
    jabSubText: [],
}

//2. Tạo reducer
const subtitlePlayReducer = (state, action) => {
    console.log('subtitlePlayReducer :', action)

    let newState = {}
    switch (action.type) {
        case REWIND: {
            newState = { ...state, rewind: action.payload }
            console.log('state: ', state)
            console.log('newState: ', newState)
            break
        }
        case GET_TIMESTAMPS: {
            newState = { ...state, timestamps: action.payload }
            console.log('newState: ', newState)
            break
        }
        default: {
            newState = state
            break
        }
    }
    return newState
}

export default subtitlePlayReducer
