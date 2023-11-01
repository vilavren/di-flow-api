import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import mongoose from 'mongoose'

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB - OK'))
  .catch((err) => console.log('DB - error', err))

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('PORT:', process.env.PORT)
  console.log('Server - OK')
})
