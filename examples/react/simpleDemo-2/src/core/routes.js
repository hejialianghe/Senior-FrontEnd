import Home from '../components/Home'
import User from '../components/User'
import NotFound from '../components/NotFound'

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/user',
    component: User,
  },
  {
    path: '',
    component: NotFound,
  },
]

export default routes
