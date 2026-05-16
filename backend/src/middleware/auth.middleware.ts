import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
interface CustomRequest extends Request {
  user?: any;
}

const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Token Required',
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
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
