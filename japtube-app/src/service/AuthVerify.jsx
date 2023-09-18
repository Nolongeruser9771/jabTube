import React, { useEffect } from 'react'
import { withRouter } from './withRouter'
import { useContext } from 'react'
import UserContext from '../context/UserContext/UserContext'
import { logout } from '../store/action'

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]))
    } catch (e) {
        return null
    }
}

const AuthVerify = (props) => {
    let location = props.router.location
    const { auth, user, dispatchUser } = useContext(UserContext)

    useEffect(() => {
        if (user) {
            const decodedJwt = parseJwt(auth.jwtToken)
            console.log(new Date(decodedJwt.exp * 1000));

            if (new Date(decodedJwt.exp * 1000) < Date.now()) {
                dispatchUser(logout())
            }
        }
    }, [location])

    return <div></div>
}

export default withRouter(AuthVerify)
