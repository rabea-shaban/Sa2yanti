import { NextFunction, Request, Response } from 'express';
interface customRequest extends Request {
  user?: any;
}

const roleMiddleware = (role: string) => {
  return (req: customRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
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
