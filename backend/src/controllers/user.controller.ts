import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import User from '../models/User.model';
import Service from '../models/Service.model';
import Settings from '../models/Settings.model';

interface IUser {
  name?: string;
  email: string;
  phone?: string;
  password: string;
  role?: 'user' | 'technician' | 'super_admin';
  location?: string;
  latitude?: number;
  longitude?: number;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role, location, latitude, longitude }: IUser = req.body;

    if (role === 'super_admin') {
      res.status(400).json({
        success: false,
        message: 'Registration as Super Admin is not allowed.',
      });
      return;
    }

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
      location,
      latitude,
      longitude,
      locationGeo: {
        type: 'Point',
        coordinates: [longitude || 0, latitude || 0],
      },
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

    if (user.role === 'super_admin') {
      res.status(403).json({
        success: false,
        message: 'Please use the dedicated Admin Login portal.',
      });
      return;
    }

    if (user.role === 'user' && (user as any).isBlocked) {
      res.status(403).json({
        success: false,
        message: 'Your account has been blocked by the Administrator.',
      });
      return;
    }

    if (user.role === 'technician' && (user as any).isSuspended) {
      res.status(403).json({
        success: false,
        message: 'Your technician account has been suspended by the Administrator.',
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
    const token = Jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY as string,
      {
        expiresIn: '1d',
      },
    );
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
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });

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

export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, location, latitude, longitude } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        res.status(400).json({ success: false, message: 'Email already exists' });
        return;
      }
      user.email = email;
    }

    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        res.status(400).json({ success: false, message: 'Phone number already exists' });
        return;
      }
      user.phone = phone;
    }

    if (name) user.name = name;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (location !== undefined) (user as any).location = location;
    if (latitude !== undefined) (user as any).latitude = latitude;
    if (longitude !== undefined) (user as any).longitude = longitude;

    if (latitude !== undefined || longitude !== undefined) {
      const lat = latitude !== undefined ? latitude : (user as any).latitude;
      const lng = longitude !== undefined ? longitude : (user as any).longitude;
      (user as any).locationGeo = {
        type: 'Point',
        coordinates: [Number(lng) || 0, Number(lat) || 0],
      };
    }

    await user.save();

    const token = Jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY as string,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: (user as any).location,
        latitude: (user as any).latitude,
        longitude: (user as any).longitude,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find({ isActive: true }).populate('category', 'name').sort({ name: 1 });
    res.status(200).json({ success: true, services });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublicSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await Settings.findOne();
    res.status(200).json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
