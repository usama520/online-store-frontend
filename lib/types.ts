export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  stockQuantity: number;
  images: string[];
  imageIds?: string[];
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
  streetAddress: string;
  city: string;
  postalCode?: string;
  state: 'open' | 'archived' | 'cancelled';
  fulfillmentStatus: 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'rejected';
  paymentStatus: 'pending' | 'authorized' | 'paid' | 'partially_paid' | 'refunded' | 'voided';
  availableStateEvents: string[];
  availableFulfillmentEvents: string[];
  availablePaymentEvents: string[];
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
  payment?: Payment;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isActive: boolean;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  logoUrl?: string;
  selectedTheme?: string;
  currencySymbol: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  contactEmail?: string;
  contactPhone?: string;
  bankAccounts: BankAccount[];
}

export interface User {
  id: string;
  email: string;
}

export interface AdminUser {
  id: string;
  email: string;
}

export interface DirectUploadInput {
  filename: string;
  byteSize: number;
  contentType: string;
  checksum: string;
}

export interface DirectUploadResponse {
  directUploadUrl: string;
  signedBlobId: string;
  uploadHeaders: string | Record<string, string>;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
