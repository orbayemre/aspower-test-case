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


const SessionValidator = (value : any) : any => {
    try{
      const validKeys = ['title', 'description', 'speaker', 'startTime', 'endTime'];
      const invalidKeys = Object.keys(value).filter((key) => !validKeys.includes(key));
      
      if (invalidKeys.length > 0) {
        return new Error(`Invalid keys in sessions: ${invalidKeys.join(', ')}`);
      }
      if(!value.title){
        return new Error("Title is required");
      }
      if(!value.startTime){
        return new Error("startTime is required");
      }
      if(!value.endTime){
        return new Error("endTime is required");
      }
      if(!value.speaker){
        return new Error("speaker is required");
      }
      else{
        if(!value.speaker.name){
            return new Error("speaker name is required");
        }
      }
      return false;
    }catch (error) {
        console.log(error)
    }
};

// Etkinlik oluşturma isteğindeki parametreler doğrulanır.
const createEventValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validationRules = [
        body('title').notEmpty().withMessage('Title is required').isString().withMessage('Title must be a string'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('location').notEmpty().withMessage('Location is required').isString().withMessage('Location must be a string'),
        body('startDate').notEmpty().withMessage('Start date is required'),
        body('endDate').notEmpty().withMessage('End date is required'),
        body('sessions').notEmpty().withMessage('Sessions are required').isArray().withMessage('Sessions must be an array'),
        body('sessions.*').custom((session) => {
            const errors = SessionValidator(session); 
            if(errors){
                return Promise.reject(errors.message);
            }
            return true;
        }),
        body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
        body('categories').optional().isArray().withMessage('Categories must be an array of strings'),
        body('isOnline').isBoolean().withMessage('isOnline must be a boolean')
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
        res.status(500).json({ message: 'Internal Server Error' });
    });
};
// Etkinlik güncelleme isteğindeki parametreler doğrulanır.
const updateEventValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validationRules = [
        body('id').notEmpty().withMessage('Id is required').isString().withMessage('Id must be a string'),
        body('title').optional().isString().withMessage('Title must be a string'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('location').optional().isString().withMessage('Location must be a string'),
        body('startDate').optional(),
        body('endDate').optional(),
        body('sessions').optional().isArray().withMessage('Sessions must be an array'),
        body('sessions.*').custom((session) => {
            const errors = SessionValidator(session); 
            if(errors){
                return Promise.reject(errors.message);
            }
            return true;
        }),
        body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
        body('categories').optional().isArray().withMessage('Categories must be an array of strings'),
        body('isOnline').optional().isBoolean().withMessage('isOnline must be a boolean')
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
        res.status(500).json({ message: 'Internal Server Error' });
    });
};


export { 
    userRegisterValidation, 
    adminCreateValidation, 
    userLoginValidation, 
    adminLoginValidation, 

    createEventValidation,
    updateEventValidation
};
