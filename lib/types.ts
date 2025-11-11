export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  stockQuantity: number;
  images: string[];
  inStock: boolean;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: Product;
}

export interface Payment {
  id: string;
  paymentMethod: string;
  status: string;
  amount: number;
  transactionId?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
  payment?: Payment;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AdminUser {
  id: string;
  email: string;
}

