import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import User from '../models/User.model';

interface CustomRequest extends Request {
  user?: any;
}

const adminAuth = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access Denied: No token provided.',
      });
      return;
    }

    const decoded: any = Jwt.verify(token, process.env.SECRET_KEY as string);

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Access Denied: User not found.',
      });
      return;
    }

    if (user.role !== 'super_admin') {
      res.status(403).json({
        success: false,
        message: 'Access Denied: Super Admin role required.',
      });
      return;
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Access Denied: Invalid or expired token.',
    });
  }
};

export default adminAuth;
