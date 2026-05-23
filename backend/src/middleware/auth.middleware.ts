import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: any;
}

const auth = (req: CustomRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });

      return;
    }

    const decoded = Jwt.verify(token, process.env.SECRET_KEY as string);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid Token',
    });
  }
};

export default auth;
