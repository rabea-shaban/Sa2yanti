import { NextFunction, Request, Response } from 'express';

const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0].message,
      });

      return;
    }

    next();
  };
};

export default validate;
