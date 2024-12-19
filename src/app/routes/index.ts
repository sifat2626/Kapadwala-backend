import { Router } from 'express'
import { AuthRoutes } from '../modules/Auth/auth.route'

import { UserRoutes } from '../modules/User/user.route'
import { DealRoutes } from '../modules/Deals/deals.route'
import { VendorRoutes } from '../modules/Vendor/vendor.route'
import { CompanyRoutes } from '../modules/Company/company.route'
import { PaymentRoutes } from '../modules/Payment/payment.route'
import { EmailRoutes } from '../modules/Email/email.route'
import { NewsletterRoutes } from '../modules/NewsLetter/newsletter.route'

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
  {
    path: '/companies',
    route: CompanyRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
  {
    path: '/mails',
    route: EmailRoutes,
  },
  {
    path: '/newsletter',
    route: NewsletterRoutes,
  },

]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
