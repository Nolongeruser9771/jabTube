import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import GlobalStyles from '@/components/GlobalStyles'
import UserProvider from './context/UserContext/UserContextProvider.jsx'
import FilmPlayContextProvider from './context/PlayFilmContext/FilmPlayContextProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.Fragment>
        <GlobalStyles>
            <UserProvider>
                <FilmPlayContextProvider>
                    <App />
                </FilmPlayContextProvider>
            </UserProvider>
        </GlobalStyles>
    </React.Fragment>
)
