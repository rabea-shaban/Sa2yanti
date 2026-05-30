import { Request, Response } from 'express';

import Order from '../models/Order.model';

interface CustomRequest extends Request {
  user?: any;
}

export const createOrder = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { service, location, latitude, longitude } = req.body;

    const order = await Order.create({
      userID: req.user.id,
      service,
      location,
      latitude,
      longitude,
    });

    res.status(201).json({
      success: true,
      message: 'Order Created Successfully',
      order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({
      userID: userId,
    })
      .populate('userID', 'name email')
      .populate('technicianId', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyOrders = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
