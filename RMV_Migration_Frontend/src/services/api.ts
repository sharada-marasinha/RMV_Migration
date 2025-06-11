import axios from 'axios';
import { MotorbikeRegistration, RegistrationNumber, NumberPlate, NewRegistration } from '../types';

const API_BASE_URL = 'http://localhost:8082/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registrationService = {
  getUserRegistrations: async (): Promise<MotorbikeRegistration[]> => {
    const response = await api.get('/registrations');
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
  addRegistrationNumber: async (registrationNumber: Partial<RegistrationNumber>): Promise<RegistrationNumber> => {
    const response = await api.post('/registrations/admin/registration-numbers', registrationNumber);
    return response.data;
  },
};

export const numberPlateService = {
  getCurrentNumberPlate: async (): Promise<NumberPlate> => {
    const response = await api.get('/number-plates/current');
    return response.data;
  },

  bookNumberPlate: async (registrationNumber: Partial<RegistrationNumber>): Promise<RegistrationNumber> => {
    const response = await api.post('/number-plates/book-number-plate', registrationNumber);
    return response.data;
  },

  charBounce: async (input: string): Promise<string> => {
    const response = await api.post(`/number-plates/char-bounce/${input}`);
    return response.data;
  },
};

export default api;