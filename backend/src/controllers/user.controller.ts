import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import User from '../models/User.model';

interface IUser {
  name?: string;
  email: string;
  phone?: string;
  password: string;
  role?: 'user' | 'technician';
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role }: IUser = req.body;

    const isUser = await User.findOne({ email });

    if (isUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists',
      });

      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      role,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: 'User Registered Successfully',
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Invalid Email or Password',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid Email or Password',
      });
      return;
    }
    const token = Jwt.sign({ id: user._id, name: user.name }, process.env.SECRET_KEY as string, {
      expiresIn: '1d',
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login Successfully',
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const profile = (req: any, res: Response) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token');

  res.status(200).json({
    success: true,
    message: 'Logout Successfully',
  });
};

export const me = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
