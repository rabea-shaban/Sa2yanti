import express from 'express';
import {
  login,
  logout,
  me,
  getDashboardStats,
  getUsers,
  blockUser,
  unblockUser,
  deleteUser,
  deleteAllUsers,
  getTechnicians,
  suspendTechnician,
  activateTechnician,
  deleteTechnician,
  deleteAllTechnicians,
  getOrders,
  updateOrder,
  deleteOrder,
  deleteAllOrders,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getServices,
  createService,
  updateService,
  deleteService,
  getStatistics,
  getSettings,
  updateSettings,
} from '../controllers/admin.controller';
import adminAuth from '../middleware/adminAuth.middleware';

const router = express.Router();

// Public login/logout
router.post('/login', login);
router.post('/logout', logout);

// Protected routes (require super_admin role)
router.get('/me', adminAuth, me);
router.get('/dashboard', adminAuth, getDashboardStats);

// User Management
router.delete('/users/all', adminAuth, deleteAllUsers);
router.get('/users', adminAuth, getUsers);
router.patch('/users/:id/block', adminAuth, blockUser);
router.patch('/users/:id/unblock', adminAuth, unblockUser);
router.delete('/users/:id', adminAuth, deleteUser);

// Technician Management
router.delete('/technicians/all', adminAuth, deleteAllTechnicians);
router.get('/technicians', adminAuth, getTechnicians);
router.patch('/technicians/:id/suspend', adminAuth, suspendTechnician);
router.patch('/technicians/:id/activate', adminAuth, activateTechnician);
router.delete('/technicians/:id', adminAuth, deleteTechnician);

// Order Management
router.delete('/orders/all', adminAuth, deleteAllOrders);
router.get('/orders', adminAuth, getOrders);
router.patch('/orders/:id', adminAuth, updateOrder);
router.delete('/orders/:id', adminAuth, deleteOrder);

// Categories CRUD
router.get('/categories', adminAuth, getCategories);
router.post('/categories', adminAuth, createCategory);
router.patch('/categories/:id', adminAuth, updateCategory);
router.delete('/categories/:id', adminAuth, deleteCategory);

// Services CRUD
router.get('/services', adminAuth, getServices);
router.post('/services', adminAuth, createService);
router.patch('/services/:id', adminAuth, updateService);
router.delete('/services/:id', adminAuth, deleteService);

// Statistics
router.get('/statistics', adminAuth, getStatistics);

// Settings
router.get('/settings', adminAuth, getSettings);
router.patch('/settings', adminAuth, updateSettings);

export default router;
