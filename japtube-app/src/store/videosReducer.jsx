import { ADD_VIDEO, UPDATE_VIDEO, DELETE_VIDEO, GET_VIDEOS } from "./constant"

//1. Tạo state
export const initVideoList = []

//2. Tạo reducer
const videosReducer = (state, action) => {
    console.log('videosReducer :', action)
    console.log({ state, action })

    let newState = {}
    switch (action.type) {
        case ADD_VIDEO: {
            newState = [...state, action.payload]
            console.log('newState: ', newState)
            break
        }
        case GET_VIDEOS: {
            newState = [action.payload]
            console.log('newState: ', newState)
            break
        }
        case UPDATE_VIDEO: {
            const { videoId } = action.payload.videoId
            newState = [
                state.map((video) => {
                    if (video.id === videoId) {
                        return action.payload.data
                    }
                    return video
                }),
            ]
            console.log('newState: ', newState)
            break
        }
        case DELETE_VIDEO: {
            newState = state.filter((video) => video.id !== action.payload)
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

export default videosReducer
