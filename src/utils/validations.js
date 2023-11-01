import { body } from 'express-validator'

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен содержать минимум 6 символов').isLength({
    min: 6,
  }),
]

export const registerValidation = [
  body('username', 'Укажите больше 4 символов').isLength({ min: 4 }),
  body('username', 'Укажите не больше 40 символов').isLength({ max: 40 }),
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен содержать минимум 6 символов').isLength({
    min: 6,
  }),
]
