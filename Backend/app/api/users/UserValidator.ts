import { body } from 'express-validator';

export const ValUsers = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),
  body('email')
    .isEmail().withMessage('Invalid email')
    .custom(value => {
        const localPart = value.split('@')[0];
        if (localPart.length <= 3) {
            throw new Error('Email username must be more than 3 characters');
        }
        return true;
  }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('re_password')
    .notEmpty()
    .withMessage('Re-entered password is required')
    .isLength({ min: 6 })
    .withMessage('Re-entered password must be at least 6 characters long')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

