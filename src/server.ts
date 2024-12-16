import { Server } from 'http'
import mongoose from 'mongoose'
import app from './app'
import seedAdmin from './app/DB'
import config from './app/config'

let server: Server

async function main() {
  try {
    const databaseUrl =
      config.NODE_ENV === 'production'
        ? config.database_url
        : config.database_dev_url
    await mongoose.connect(databaseUrl as string)

    seedAdmin()
    server = app.listen(config.port, () => {
      console.log(`Server app is listening on port ${config.port}`)
    })
  } catch (err) {
    console.log(err)
  }
}

main()

process.on('unhandledRejection', (err) => {
  console.log(`UnhandledRejection is detected , shutting down ...`, err)

  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('uncaughtException', () => {
  console.log(`UncaughtException is detected , shutting down ...`)
  process.exit(1)
})
