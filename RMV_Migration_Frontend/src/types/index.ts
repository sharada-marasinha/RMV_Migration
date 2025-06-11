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
  numberPlate: string;
  price: number;
  category: 'NORMAL' | 'SPECIAL';
  specialCategory: 'NORMAL' | 'MILESTONE' | 'ONE_REPETITION' | 'TWO_REPETITIONS' | 'FULL_REPETITION' | 'CHARACTER_BUMP';
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