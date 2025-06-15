export interface RegistrationNumber {
  id: number;
  number: string;
  numberType: 'NORMAL' | 'SPECIAL';
  category: 'NORMAL' | 'MILESTONE' | 'ONE_REPETITION' | 'TWO_REPETITIONS' | 'FULL_REPETITION' | 'CHARACTER_BUMP';
  price: number;
  available: boolean;
  locked: boolean;
  lockExpiresAt?: string;
  lockedByUserId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MotorbikeRegistration {
  id: number;
  registrationNumber: string;
  ownerName: string;
  ownerAddress: string;
  ownerEmail: string;
  motorbikeMake: string;
  motorbikeModel: string;
  chassisNumber: string;
  engineNumber: string;
  totalAmount: number;
  registrationType: string;
  registrationFee: number;
  deliveryDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  dealerName: string;
  dealerAddress: string;
  buyerName: string;
  buyerAddress: string;
  paymentReference: string;
  paymentDate: string;
  paidBy: string;
  amountPaid: number;
  paymentPurpose: string;
  bankName: string;
  bankBranch: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  registeredByUserId: number;
  registeredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface NumberPlate {
  id: number,
  numberPlate: string;
  price: number;
  isAvailable: boolean,
  numberCategory: 'NORMAL' | 'MILESTONE' | 'ONE_REPETITION' | 'TWO_REPETITIONS' | 'FULL_REPETITION' | 'CHARACTER_BUMP',
  createdAt: any,
  updatedAt: any
}

export interface NewRegistration {
  ownerName: string;
  ownerAddress: string;
  ownerEmail: string;
  motorbikeMake: string;
  motorbikeModel: string;
  chassisNumber: string;
  engineNumber: string;
  registrationType: 'NORMAL' | 'SPECIAL';
  specialNumber?: string;
  invoiceFile?: File;
  paymentFile?: File;
}

export interface OCRData {
  dealerName?: string;
  dealerAddress?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  buyerName?: string;
  buyerAddress?: string;
  motorbikeMake?: string;
  motorbikeModel?: string;
  chassisNumber?: string;
  engineNumber?: string;
  totalAmount?: number;
  deliveryDate?: string;
  bankName?: string;
  bankBranch?: string;
  paymentDate?: string;
  paymentReference?: string;
  paidBy?: string;
  amountPaid?: number;
  paymentPurpose?: string;
}

export type User = {
    userId: string;
    username: string;
    fullName: string;
    token: string;
    role?: string;
};

export type LoginResponse = {
  user: Omit<User, 'token'>;
  token: string;
};

export type TabType = 'dashboard' | 'settings' | 'profile';