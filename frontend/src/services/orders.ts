import axiosInstance from './Api';

export const getAvailableOrders = () => axiosInstance.get('/orders/available');

export const getMyOrders = () => axiosInstance.get('/orders/my');

export const getMyJobs = () => axiosInstance.get('/orders/my-jobs');

export const rejectOrder = (orderId: string) =>
  axiosInstance.patch(`/orders/${orderId}/status`, { status: 'cancelled' });

export const acceptOrder = (orderId: string) =>
  axiosInstance.post(`/orders/${orderId}/accept`);

export const updateOrderStatus = (orderId: string, status: string) =>
  axiosInstance.patch(`/orders/${orderId}/status`, { status });
