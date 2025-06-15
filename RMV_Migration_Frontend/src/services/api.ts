import axios from 'axios';
import { MotorbikeRegistration, RegistrationNumber, NumberPlate, LoginResponse } from '../types';

const API_BASE_URL = 'http://localhost:8082/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized! Token may have expired.');
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Save token to localStorage for interceptor
    if (data?.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  },

  register: async (
    email: string,
    password: string,
    additionalData?: Record<string, any>
  ): Promise<string> => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        ...additionalData,
      }),
    });
    return await response.json();
  },
};

export const registrationService = {
  getUserRegistrations: async (): Promise<MotorbikeRegistration[]> => {
    const response = await api.get('/registrations');
    return response.data;
  },

  submitRegistration: async (registrationData: {
    ownerName: string;
    registrationNumber: string,
    ownerAddress: string;
    ownerEmail: string;
    motorbikeMake: string;
    motorbikeModel: string;
    chassisNumber: string;
    engineNumber: string;
    totalAmount: number;
    registrationType: string;
    registrationFee: number;
    deliveryDate?: Date;
    invoiceNumber: string;
    invoiceDate: Date;
    dealerName: string;
    dealerAddress: string;
    buyerName: string;
    buyerAddress: string;
    paymentReference: string;
    paymentDate: Date;
    paidBy: string;
    amountPaid: number;
    paymentPurpose: string;
    bankName: string;
    bankBranch: string;
    status?: string;
    registeredByUserId: number;
  }): Promise<MotorbikeRegistration> => {
    // Format dates to ISO string
    const payload = {
      ...registrationData,
      delivery_date: registrationData.deliveryDate?.toISOString(),
      invoice_date: registrationData.invoiceDate.toISOString(),
      payment_date: registrationData.paymentDate.toISOString(),
      status: registrationData.status || 'PENDING'
    };
    console.log(payload);



    const response = await api.post('/registrations', payload);
    return response.data;
  },

  getRegistration: async (id: number): Promise<MotorbikeRegistration> => {
    const response = await api.get(`/registrations/${id}`);
    return response.data;
  },

  getAvailableSpecialNumbers: async (): Promise<RegistrationNumber[]> => {
    const response = await api.get('/registrations/special-numbers');
    return response.data;
  },

  lockSpecialNumber: async (number: string): Promise<any> => {
    const response = await api.post(`/registrations/lock-special-number/${number}`);
    return response.data;
  },

  addRegistrationNumber: async (
    registrationNumber: Partial<RegistrationNumber>
  ): Promise<RegistrationNumber> => {
    const response = await api.post(
      '/registrations/admin/registration-numbers',
      registrationNumber
    );
    return response.data;
  },
};

export const numberPlateService = {

  getCurrentNumberPlate: async (): Promise<NumberPlate> => {
    const response = await api.get('/number-plates/current');
    return response.data;
  },

  bookNumberPlate: async (
    registrationNumber: Partial<RegistrationNumber>
  ): Promise<RegistrationNumber> => {
    const response = await api.post('/number-plates/book-number-plate', registrationNumber);
    return response.data;
  },

  charBounce: async (input: string): Promise<string> => {
    const response = await api.post(`/number-plates/char-bounce/${input}`);
    return response.data;
  },
};

export default api;
