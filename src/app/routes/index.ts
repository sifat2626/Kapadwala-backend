import { Router } from 'express'
import { AuthRoutes } from '../modules/Auth/auth.route'

import { UserRoutes } from '../modules/User/user.route'
import { DealRoutes } from '../modules/Deals/deals.route'
import { VendorRoutes } from '../modules/Vendor/vendor.route'

const router = Router()

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/deals',
    route: DealRoutes,
  },
  {
    path: '/vendors',
    route: VendorRoutes,
  },

]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
