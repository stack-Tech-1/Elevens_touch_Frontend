export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  badge?: 'new' | 'sale' | 'bestseller';
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export interface OrderItem {
  product: Product | string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  paymentRef?: string;
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  ordersByStatus: Record<string, number>;
  recentOrders: Order[];
  topProducts: { _id: string; name: string; image?: string; unitsSold: number; revenue: number }[];
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'name-asc';
}
