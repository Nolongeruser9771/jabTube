import { useReducer } from 'react'
import userReducer, { initUser } from '../../store/userReducer'
import UserContext from './UserContext'
import likedFilmsReducer, { initLikedFilms } from '../../store/likedFilmsReducer'
import authReducer, { initAuth } from '../../store/authReducer'

function UserProvider({ children }) {
    const [user, dispatchUser] = useReducer(userReducer, initUser)
    const [auth, dispatchAuth] = useReducer(authReducer, initAuth)
    const [likedFilms, dispatchLikedFilm] = useReducer(likedFilmsReducer, initLikedFilms)

    const value = {
        user,
        dispatchUser,
        likedFilms,
        dispatchLikedFilm,
        auth,
        dispatchAuth,
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserProvider
