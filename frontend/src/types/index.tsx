export type OrderStatus = 'pending' | 'accepted' | 'done';
export type ServiceType = 'تغيير زيت' | 'بطارية' | 'كشف أعطال';



export interface Order {
  _id: string;

  service: ServiceType;
  location: string;

  status: OrderStatus;

  createdAt: string;
  updatedAt: string;

  userID: {
    _id: string;
    name: string;
    email: string;
  };

  technicianId?: {
    _id: string;
    name: string;
    phone?: string;
  } | null;
}
