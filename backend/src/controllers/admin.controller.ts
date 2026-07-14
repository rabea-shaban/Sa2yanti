import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';
import User from '../models/User.model';
import Order from '../models/Order.model';
import Category from '../models/Category.model';
import Service from '../models/Service.model';
import Settings from '../models/Settings.model';

const isProduction = process.env.NODE_ENV === 'production';

interface CustomRequest extends Request {
  user?: any;
}

// ==========================================
// 1. ADMIN AUTHENTICATION
// ==========================================

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: 'Invalid Email or Password' });
      return;
    }

    if (user.role !== 'super_admin') {
      res.status(403).json({ success: false, message: 'Access Denied: Not a Super Admin' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid Email or Password' });
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
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Admin Login Successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
  res.status(200).json({ success: true, message: 'Admin Logout Successful' });
};

export const me = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. DASHBOARD STATS
// ==========================================

export const getDashboardStats = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalTechnicians = await User.countDocuments({ role: 'technician' });
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const totalServices = await Service.countDocuments();

    const recentOrders = await Order.find()
      .populate('userID', 'name email phone')
      .populate('technicianId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalTechnicians,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalServices,
      },
      recentOrders,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. USER MANAGEMENT
// ==========================================

export const getUsers = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const search = req.query.search ? String(req.query.search) : '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query: any = { role: 'user' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const blockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'User blocked successfully', user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unblockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'User unblocked successfully', user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await User.deleteMany({ role: 'user' });
    res.status(200).json({ success: true, message: 'All users deleted successfully', count: result.deletedCount });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. TECHNICIAN MANAGEMENT
// ==========================================

export const getTechnicians = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const search = req.query.search ? String(req.query.search) : '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query: any = { role: 'technician' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const technicians = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      technicians,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const suspendTechnician = async (req: Request, res: Response): Promise<void> => {
  try {
    const technician = await User.findByIdAndUpdate(req.params.id, { isSuspended: true }, { new: true });
    if (!technician) {
      res.status(404).json({ success: false, message: 'Technician not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Technician suspended successfully', technician });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const activateTechnician = async (req: Request, res: Response): Promise<void> => {
  try {
    const technician = await User.findByIdAndUpdate(req.params.id, { isSuspended: false }, { new: true });
    if (!technician) {
      res.status(404).json({ success: false, message: 'Technician not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Technician activated successfully', technician });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTechnician = async (req: Request, res: Response): Promise<void> => {
  try {
    const technician = await User.findByIdAndDelete(req.params.id);
    if (!technician) {
      res.status(404).json({ success: false, message: 'Technician not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Technician deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAllTechnicians = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await User.deleteMany({ role: 'technician' });
    res.status(200).json({ success: true, message: 'All technicians deleted successfully', count: result.deletedCount });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. ORDERS MANAGEMENT
// ==========================================

export const getOrders = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const search = req.query.search ? String(req.query.search) : '';
    const status = req.query.status ? String(req.query.status) : '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      // Find matching user IDs first to allow searching orders by customer name
      const matchingUsers = await User.find({
        name: { $regex: search, $options: 'i' },
      }).select('_id');
      const userIds = matchingUsers.map((u) => u._id);

      query.$or = [
        { service: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { userID: { $in: userIds } },
      ];
    }

    const orders = await Order.find(query)
      .populate('userID', 'name email phone')
      .populate('technicianId', 'name phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { technicianId, status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    if (technicianId !== undefined) {
      order.technicianId = technicianId || null;
      // Automatically set status to accepted if technician is assigned and it was pending
      if (technicianId && order.status === 'pending') {
        order.status = 'accepted';
      }
    }

    if (status) {
      order.status = status;
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('userID', 'name email phone')
      .populate('technicianId', 'name phone email');

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await Order.deleteMany({});
    res.status(200).json({ success: true, message: 'All orders deleted successfully', count: result.deletedCount });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 6. CATEGORIES MANAGEMENT (CRUD)
// ==========================================

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, isActive } = req.body;
    const category = await Category.create({ name, description, isActive });
    res.status(201).json({ success: true, message: 'Category created successfully', category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Category updated successfully', category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    // Optional check: are there services in this category?
    const servicesCount = await Service.countDocuments({ category: req.params.id });
    if (servicesCount > 0) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete category containing active services. Please delete or reassign them first.',
      });
      return;
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 7. SERVICES MANAGEMENT (CRUD)
// ==========================================

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find().populate('category', 'name').sort({ name: 1 });
    res.status(200).json({ success: true, services });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, category, price, image, isActive } = req.body;
    const service = await Service.create({ name, description, category, price, image, isActive });
    const populated = await Service.findById(service._id).populate('category', 'name');
    res.status(201).json({ success: true, message: 'Service created successfully', service: populated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('category', 'name');
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Service updated successfully', service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 8. STATISTICS & ANALYTICS
// ==========================================

export const getStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userGrowth = await User.aggregate([
      { $match: { role: 'user' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const techGrowth = await User.aggregate([
      { $match: { role: 'technician' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const orderDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      userGrowth,
      techGrowth,
      orderDistribution,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 9. WEBSITE SETTINGS
// ==========================================

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.status(200).json({ success: true, message: 'Settings updated successfully', settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
