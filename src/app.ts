import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import express, { Application, Request, Response } from 'express'
import globalErrorHandler from './app/middlewares/globalErrorhandler'
import notFound from './app/middlewares/notFound'
import router from './app/routes'
import { PaymentController } from './app/modules/Payment/payment.controller'
import './app/modules/NewsLetter/newsletter.cron';

const app: Application = express()

// Route to handle Stripe webhook
app.use(`/api/v1/payments/webhook`,express.raw({ type: 'application/json' }), PaymentController.stripeWebhook);

//parsers
app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: ['http://localhost:5173','http://localhost:3000', 'https://kkapadwala-frontend.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  }),
)

app.use(morgan('dev'))
//
// // application routes
app.use('/api/v1', router)

app.get('/', (_req: Request, res: Response) => {
  res.send('Hi, Server Root Route Working !')
})

app.get('/health', (_req: Request, res: Response) => {
  res.send('Wow! Well API Health...')
})

app.use(globalErrorHandler)

// Global Not Found
app.use(notFound)

export default app
