import {
    LOGIN,
    LOGOUT,
    LIKE_FILM,
    UPDATE_PROFILE,
    REWIND,
    CHANGE_FILM,
    CHANGE_VIDEO,
    ADD_FAVORITE,
    REMOVE_FAVORITE,
    UNLIKE_FILM,
    GET_TIMESTAMPS,
    ADD_FILM,
    UPDATE_FILM,
    DELETE_FILM,
    ADD_VIDEO,
    UPDATE_VIDEO,
    DELETE_VIDEO,
    SET_AUTH,
    UPDATE_AUTH,
    ADD_SUBTITLE,
    DELETE_SUBTITLE,
    GET_FILMS,
    GET_VIDEOS,
    GET_LIST,
} from './constant'

//Định nghĩa action

//------------------------------Auth---------------------------------------------
export const login = (data) => {
    return {
        type: LOGIN,
        payload: data,
    }
}

export const logout = () => {
    return {
        type: LOGOUT,
    }
}

//------------------------------User---------------------------------------------
export const updateProfile = (data) => {
    return {
        type: UPDATE_PROFILE,
        payload: data, // thông tin của user cần cập nhật
    }
}

//------------------------------Film Play----------------------------------------
export const likeFilm = () => {
    return {
        type: LIKE_FILM,
    }
}

export const unLikeFilm = () => {
    return {
        type: UNLIKE_FILM,
    }
}

export const changeFilm = (data) => {
    return {
        type: CHANGE_FILM,
        payload: data,
    }
}

//------------------------------Favorite Film List--------------------------------------
export const addFavorite = (data) => {
    return {
        type: ADD_FAVORITE,
        payload: data,
    }
}

export const removeFavorite = (data) => {
    return {
        type: REMOVE_FAVORITE,
        payload: data,
    }
}

export const getList = (data) => {
    return {
        type: GET_LIST,
        payload: data,
    }
}

//------------------------------Subtitle--------------------------------------
export const rewind = (data) => {
    return {
        type: REWIND,
        payload: data,
    }
}

export const getTimestamps = (data) => {
    return {
        type: GET_TIMESTAMPS,
        payload: data,
    }
}

//------------------------------Video Play--------------------------------------
export const changeVideo = (data) => {
    return {
        type: CHANGE_VIDEO,
        payload: data,
    }
}

//------------------------------List film--------------------------------------
export const addFilm = (data) => {
    return {
        type: ADD_FILM,
        payload: data,
    }
}

export const updateFilm = (data) => {
    return {
        type: UPDATE_FILM,
        payload: data,
    }
}

export const getFilms = (data) => {
    return {
        type: GET_FILMS,
        payload: data,
    }
}

export const deleteFilm = (data) => {
    return {
        type: DELETE_FILM,
        payload: data,
    }
}

//------------------------------List videos--------------------------------------

export const addVideo = (data) => {
    return {
        type: ADD_VIDEO,
        payload: data,
    }
}

export const updateVideo = (data) => {
    return {
        type: UPDATE_VIDEO,
        payload: data,
    }
}

export const getVideos = (data) => {
    return {
        type: GET_VIDEOS,
        payload: data,
    }
}

export const deleteVideo = (data) => {
    return {
        type: DELETE_VIDEO,
        payload: data,
    }
}

//--------------------------authentication-------------------------------------
export const setAuth = (data) => {
    return {
        type: SET_AUTH,
        payload: data,
    }
}

export const updateAuth = (data) => {
    return {
        type: UPDATE_AUTH,
        payload: data,
    }
}