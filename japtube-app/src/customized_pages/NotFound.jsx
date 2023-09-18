import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '10rem', color: 'grey'}}>404</h1>
            <p style={{ fontSize: '5rem' }}>Page Not Found</p>
            <Link to={'/'}>
                <button>Back Home</button>
            </Link>
        </div>
    )
}
