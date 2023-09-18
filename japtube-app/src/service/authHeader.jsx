import secureLocalStorage from 'react-secure-storage'

export default function authHeader() {
    const auth = secureLocalStorage.getItem('thisAuth')

    if (auth && auth.jwtToken) {
        return { Authorization: 'Bearer ' + auth.jwtToken }
    } else {
        return {}
    }
}
