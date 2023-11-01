import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../models/User.model.js'

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    const checkUsername = await UserModel.find({ username: username })
    const checkEmail = await UserModel.find({ email: email })

    if (checkUsername)
      return res
        .status(400)
        .json({ message: 'Пользователь с таким именем уже существует' })

    if (checkEmail)
      return res
        .status(400)
        .json({ message: 'Пользователь с такой почтой уже зарегистрирован' })

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const doc = new UserModel({
      username: username,
      email: email,
      passwordHash: hash,
    })

    const user = await doc.save()
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.PASSWORD_SECRET_KEY,
      {
        expiresIn: '30d',
      }
    )

    const { passwordHash, ...userData } = user._doc

    res.status(201).json({
      ...userData,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email: email })

    if (!user) {
      return res.status(401).json({
        message: 'Неверный логин или пароль',
      })
    }

    const isValidPass = await bcrypt.compare(password, user._doc.passwordHash)

    if (!isValidPass) {
      return res.status(401).json({
        message: 'Неверный логин или пароль',
      })
    }

    const token = jwt.sign({ _id: user._id }, process.env.PASSWORD_SECRET_KEY, {
      expiresIn: '30d',
    })

    const { passwordHash, ...userData } = user._doc

    res.status(200).json({
      ...userData,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (!user) {
      return res.status(401).json({
        message: 'Пользователь не найден',
      })
    }
    const { passwordHash, ...userData } = user._doc

    res.json(userData)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Нет доступа',
    })
  }
}
