import { Fragment } from 'react'
//Frament là thẻ chỉ để chứa, ko sinh ra thẻ thật
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { adminRoutes, publicRoutes, registeredUserRoutes } from './routes'
import DefaultLayout from '@/components/Layout/DefaultLayout'
import ScrollToTop from './components/Layout/components/ScrollToTop/index.jsx'
import AdminRoutes from './pages/private/AdminRoutes'
import RegisteredUserRoutes from './pages/private/RegisteredUserRoutes'
import NotFound from './customized_pages/NotFound'
import AuthVerify from './service/authVerify'

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        // nếu page không có layout riêng thì lấy default layout
                        let Layout = DefaultLayout
                        if (route.layout) {
                            Layout = route.layout
                        } else if (route.layout === null) {
                            Layout = Fragment
                        }

                        const Page = route.component

                        let PageInside = Fragment
                        if (route.element) {
                            PageInside = route.element
                        }

                        return (
                            <Route key={index} path={route.path}
                            element={<Layout>
                                        <Page />
                                        {/* page thành content cho Layout */}
                                        <PageInside>{/* PageInside làm content cho Page*/}</PageInside>
                                    </Layout>
                                }
                            />
                        )
                    })}

                    <Route element={<AdminRoutes />}>
                        {adminRoutes.map((route, index) => {
                            let Layout = DefaultLayout
                            if (route.layout) {
                                Layout = route.layout
                            } else if (route.layout === null) {
                                Layout = Fragment
                            }

                            const Page = route.component

                            let PageInside = Fragment
                            if (route.element) {
                                PageInside = route.element
                            }

                            return (
                                <Route key={index} path={route.path}
                                    element={<Layout><Page /><PageInside></PageInside></Layout>}
                                />
                            )
                        })}
                    </Route>

                    <Route element={<RegisteredUserRoutes />}>
                        {registeredUserRoutes.map((route, index) => {
                            let Layout = DefaultLayout
                            if (route.layout) {
                                Layout = route.layout
                            } else if (route.layout === null) {
                                Layout = Fragment
                            }

                            const Page = route.component

                            let PageInside = Fragment
                            if (route.element) {
                                PageInside = route.element
                            }

                            return (
                                <Route key={index} path={route.path}
                                    element={<Layout><Page /><PageInside></PageInside></Layout>}
                                />
                            )
                        })}
                    </Route>
                    <Route path='*' element={<NotFound />}/>
                </Routes>
            </div>
            <AuthVerify />
        </Router>
    )
}

export default App
