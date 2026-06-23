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

export const getOrders = async (req: CustomRequest, res: Response): Promise<void> => {
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
      userID: req.user.id,
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

export const getAvailableOrders = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({
      status: 'pending',
    })
      .populate('userID', 'name phone')
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

export const acceptOrder = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });

      return;
    }

    if (order.status !== 'pending') {
      res.status(400).json({
        success: false,
        message: 'Order already assigned',
      });

      return;
    }

    order.technicianId = req.user.id;

    order.status = 'accepted';

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order accepted successfully',
      order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyJobs = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({
      technicianId: req.user.id,
    })
      .populate('userID', 'name phone email')
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

export const updateOrderStatus = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });

      return;
    }

    if (String(order.technicianId) !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });

      return;
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};