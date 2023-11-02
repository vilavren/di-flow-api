import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import mongoose from 'mongoose'
import { loginValidation, registerValidation } from './src/utils/validations.js'
import { handleValidationErrors } from './src/utils/handleValidationErrors.js'
import { UserController } from './src/controllers/index.js'
import { checkAuth } from './src/utils/checkAuth.js'

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('DB: OK')
    console.log('DB name:', mongoose.connection.name)
  })
  .catch((err) => console.log('DB: error', err))

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

// user
app.post(
  '/auth/register',
  registerValidation,
  handleValidationErrors,
  UserController.register
)

app.post(
  '/auth/login',
  loginValidation,
  handleValidationErrors,
  UserController.login
)

app.get('/auth/me', checkAuth, UserController.getMe)

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('PORT:', process.env.PORT)
  console.log('Server: OK')
})
