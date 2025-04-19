import { body } from 'express-validator';

export const AuthVal = {
    login: [
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    register: [
        body('email')
            .isEmail().withMessage('Invalid email')
            .custom(value => {
                const localPart = value.split('@')[0];
                if (localPart.length <= 3) {
                    throw new Error('Email username must be more than 3 characters');
                }
                return true;
            }),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    ]
}