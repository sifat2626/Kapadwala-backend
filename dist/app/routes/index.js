"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/Auth/auth.route");
const user_route_1 = require("../modules/User/user.route");
const deals_route_1 = require("../modules/Deals/deals.route");
const vendor_route_1 = require("../modules/Vendor/vendor.route");
const company_route_1 = require("../modules/Company/company.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const email_route_1 = require("../modules/Email/email.route");
const newsletter_route_1 = require("../modules/NewsLetter/newsletter.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/deals',
        route: deals_route_1.DealRoutes,
    },
    {
        path: '/vendors',
        route: vendor_route_1.VendorRoutes,
    },
    {
        path: '/companies',
        route: company_route_1.CompanyRoutes,
    },
    {
        path: '/payments',
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: '/mails',
        route: email_route_1.EmailRoutes,
    },
    {
        path: '/newsletter',
        route: newsletter_route_1.NewsletterRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
