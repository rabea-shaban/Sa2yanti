import { NextFunction, Request, Response } from 'express';
interface customRequest extends Request {
  user?: any;
}

const roleMiddleware = (...roles: string[]) => {
  return (req: customRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access Denied',
      });
      return;
    }
    next();
  };
};

export default roleMiddleware;
