import Header from '../components/Header'
import Sidebar from './Sidebar'
import MobileSidebar from './Sidebar/components/MobileSidebar'

const API_URL = 'http://localhost:8080'

function DefaultLayout({ children }) {
    return (
        <div>
            <Header />
            <div className="container">
                <Sidebar />
                <div className="content">{children}</div>
            </div>
        </div>
    )
}

export default DefaultLayout
