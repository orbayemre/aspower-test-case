import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Kullanıcı kayıt etme isteğindeki parametreler doğrulanır
const userRegisterValidation =(req: Request, res: Response, next: NextFunction): void => {
    const validationRules = [
        body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
        body('surname').optional(),
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
        body('password').notEmpty().withMessage('Password is required'),

    ];
  
    Promise.all(validationRules.map((validationRule) => validationRule.run(req)))
    .then(() => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const errorMessage = errors.array()[0].msg;
        return res.status(422).json({ message: errorMessage });
    })
    .catch((error) => {
        console.error('Validation error:', error);
        res.status(500).json({ message : 'Internal Server Error' });
    });
};

// Admin kayıt etme isteğindeki parametreler doğrulanır
const adminCreateValidation =(req: Request, res: Response, next: NextFunction): void => {
    const validationRules = [
        body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
        body('surname').optional(),
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
        body('password').notEmpty().withMessage('Password is required'),

    ];
  
    Promise.all(validationRules.map((validationRule) => validationRule.run(req)))
    .then(() => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const errorMessage = errors.array()[0].msg;
        return res.status(422).json({ message: errorMessage });
    })
    .catch((error) => {
        console.error('Validation error:', error);
        res.status(500).json({ message : 'Internal Server Error' });
    });
};

// Kullanıcı giriş isteğindeki parametreler doğrulanır
const userLoginValidation =(req: Request, res: Response, next: NextFunction): void => {
    const validationRules = [
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
        body('password').notEmpty().withMessage('Password is required'),

    ];
  
    Promise.all(validationRules.map((validationRule) => validationRule.run(req)))
    .then(() => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const errorMessage = errors.array()[0].msg;
        return res.status(422).json({ message: errorMessage });
    })
    .catch((error) => {
        console.error('Validation error:', error);
        res.status(500).json({ message : 'Internal Server Error' });
    });
};

// Admin giriş isteğindeki parametreler doğrulanır
const adminLoginValidation =(req: Request, res: Response, next: NextFunction): void => {
    const validationRules = [
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
        body('password').notEmpty().withMessage('Password is required'),

    ];
  
    Promise.all(validationRules.map((validationRule) => validationRule.run(req)))
    .then(() => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const errorMessage = errors.array()[0].msg;
        return res.status(422).json({ message: errorMessage });
    })
    .catch((error) => {
        console.error('Validation error:', error);
        res.status(500).json({ message : 'Internal Server Error' });
    });
};

export { userRegisterValidation, adminCreateValidation, userLoginValidation, adminLoginValidation };
