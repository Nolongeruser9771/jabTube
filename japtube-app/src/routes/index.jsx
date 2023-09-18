//layouts
import HeaderOnly from '../components/Layout/HeaderOnly'

import Home from '@/pages/Home'
import ShortSurffing from '../pages/ShortSurffing'
import VideoView from '@/pages/VideoView'
import FavoriteFilm from '../pages/FavoriteFilm'
import History from '../pages/History'
import UserInfo from '../pages/UserInfo'
import Search from '../pages/Search'
import Login from '../pages/Login'
import PackageInfo from '../pages/UserInfo/components/PackageInfo'
import UserDetail from '../pages/UserInfo/components/UserDetail'
import Packages from '../pages/Package'
import PlayList from '../pages/UserInfo/components/PlayList'
import AdminLayout from '../components/AdminLayout'
import DashBoard from '../pages_admin/DashBoard'
import OrderManagement from '../pages_admin/OrderManagment'
import ShortsCut from '../pages/ShortsCut'
import UserMangament from '../pages_admin/UserMangament'
import FilmManagement from '../pages_admin/FilmManagement'
import Categories from '../pages_admin/Categories'
import FilmDetails from '../pages_admin/FilmDetails'
import Member from '../pages_admin/Member'
import FilmCreator from '../pages_admin/FilmCreator'
import VideoEditor from '../pages_admin/VideoEditor'
import Explore from '../pages/Explore'
import forgotPassword from '../pages/ForgotPassword'
import AccountVerifySuccess from '../customized_pages/accountVerifySuccess'

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/view-video/:filmId/:ep', component: VideoView, layout: HeaderOnly },
    { path: '/favorite-film', component: FavoriteFilm },
    { path: '/history', component: History },
    { path: '/search/:searchValue', component: Search },
    { path: '/login', component: Login, layout: null },
    { path: '/playlist', component: UserInfo, element: PlayList },
    { path: '/buy-package', component: Packages, layout: null },
    { path: '/explore', component: Explore },
    { path: `/account-verify/:accountVerifyToken`, component: AccountVerifySuccess, layout: null },
    { path: '/shorts/:shortsId', component: ShortSurffing, layout: HeaderOnly },
    { path: '/playlist/:playlistId', component: ShortSurffing, layout: HeaderOnly },
    { path: `/change-password/:forgotPassConfirmToken`, component: forgotPassword, layout: null },
]

const adminRoutes = [
    { path: '/admin/dashboard', component: DashBoard, layout: AdminLayout },
    { path: '/admin/orders', component: OrderManagement, layout: AdminLayout },
    { path: '/admin/users', component: UserMangament, layout: AdminLayout },
    { path: '/admin/films', component: FilmManagement, layout: AdminLayout },
    { path: '/admin/categories', component: Categories, layout: AdminLayout },
    { path: '/admin/films/:filmId', component: FilmDetails, layout: AdminLayout },
    { path: '/admin/members', component: Member, layout: AdminLayout },
    { path: '/admin/films/create', component: FilmCreator, layout: AdminLayout },
    { path: '/admin/films/:filmId/:videoId', component: VideoEditor, layout: AdminLayout },
    { path: '/admin/members/info/:userId', component: UserInfo, element: UserDetail, layout: AdminLayout },
]

const registeredUserRoutes = [
    { path: '/short-making/:videoId', component: ShortsCut, layout: HeaderOnly },
    { path: '/user-page', component: UserInfo, element: UserDetail },
    { path: '/package-info', component: UserInfo, element: PackageInfo },
]

export { publicRoutes, registeredUserRoutes, adminRoutes }
