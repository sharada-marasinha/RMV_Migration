import React, { useState, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, User, Car, CreditCard } from 'lucide-react';
import { numberPlateService, registrationService } from '../services/api';
import { NewRegistration, OCRData } from '../types';
import { parseInvoiceFile, parsePaymentFile, validateOCRData } from '../utils/ocrParser';
import { formatPrice, getSpecialNumberPrice } from '../utils/pricing';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCurrentNumberPlate } from '../store/numberPlateSlice';

const NewRegistrationForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { current, loading, error } = useAppSelector((state) => state.numberPlate);

  useEffect(() => {
    dispatch(fetchCurrentNumberPlate());
  }, [dispatch]);

  const [formData, setFormData] = useState<NewRegistration>({
    ownerName: '',
    ownerAddress: '',
    ownerEmail: '',
    motorbikeMake: '',
    motorbikeModel: '',
    chassisNumber: '',
    engineNumber: '',
    registrationType: 'NORMAL',
  });

  const [ocrData, setOcrData] = useState<{
    invoice: Partial<OCRData>;
    payment: Partial<OCRData>;
  }>({
    invoice: {},
    payment: {},
  });

  const [files, setFiles] = useState<{
    invoice: File | null;
    payment: File | null;
  }>({
    invoice: null,
    payment: null,
  });

  const [step, setStep] = useState(1);
  const [btnLoading, setBtnLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof NewRegistration, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (type: 'invoice' | 'payment', file: File) => {
    if (!file.type.includes('text')) {
      setErrors(['Please upload text files only (OCR output)']);
      return;
    }

    try {
      const text = await file.text();
      let parsedData: Partial<OCRData> = {};

      if (type === 'invoice') {
        parsedData = parseInvoiceFile(text);
        console.log(parsedData);

        setOcrData((prev) => ({ ...prev, invoice: parsedData }));

        // Auto-fill form with invoice data
        if (parsedData.buyerName) handleInputChange('ownerName', parsedData.buyerName);
        if (parsedData.buyerAddress) handleInputChange('ownerAddress', parsedData.buyerAddress);
        if (parsedData.motorbikeMake) handleInputChange('motorbikeMake', parsedData.motorbikeMake);
        if (parsedData.motorbikeModel) handleInputChange('motorbikeModel', parsedData.motorbikeModel);
        if (parsedData.chassisNumber) handleInputChange('chassisNumber', parsedData.chassisNumber);
        if (parsedData.engineNumber) handleInputChange('engineNumber', parsedData.engineNumber);
      } else {
        parsedData = parsePaymentFile(text);
        setOcrData((prev) => ({ ...prev, payment: parsedData }));
      }

      setFiles((prev) => ({ ...prev, [type]: file }));
      setErrors([]);
    } catch (error) {
      setErrors(['Error reading file. Please ensure it\'s a valid text file.']);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.ownerName) newErrors.push('Owner name is required');
    if (!formData.ownerAddress) newErrors.push('Owner address is required');
    if (!formData.ownerEmail) newErrors.push('Owner email is required');
    if (!formData.motorbikeMake) newErrors.push('Motorbike make is required');
    if (!formData.motorbikeModel) newErrors.push('Motorbike model is required');
    if (!formData.chassisNumber) newErrors.push('Chassis number is required');
    if (!formData.engineNumber) newErrors.push('Engine number is required');
    if (!files.invoice) newErrors.push('Invoice file is required');
    if (!files.payment) newErrors.push('Payment proof file is required');

    // Validate OCR data consistency
    const ocrErrors = validateOCRData(ocrData.invoice, ocrData.payment);
    newErrors.push(...ocrErrors);

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const calculateTotal = (): number => {
    if (formData.registrationType === 'SPECIAL' && formData.specialNumber) {

      return getSpecialNumberPrice('ONE_REPETITION');
    }
    return getSpecialNumberPrice('NORMAL');
  };

  const handleSubmit = async () => {

    try {
      setBtnLoading(true);
      const currentNumberPlate = await numberPlateService.getCurrentNumberPlate();
      console.log(currentNumberPlate);

      const registrationData = {
        ownerName: formData.ownerName,
        registrationNumber: currentNumberPlate.numberPlate,
        ownerAddress: formData.ownerAddress,
        ownerEmail: formData.ownerEmail,
        motorbikeMake: formData.motorbikeMake,
        motorbikeModel: formData.motorbikeModel,
        chassisNumber: formData.chassisNumber,
        engineNumber: formData.engineNumber,
        totalAmount: calculateTotal(),
        registrationType: formData.registrationType,
        registrationFee: calculateTotal(),
        deliveryDate: new Date(),
        invoiceNumber: ocrData.invoice.invoiceNumber || '',
        invoiceDate: ocrData.invoice.invoiceDate ? new Date(ocrData.invoice.invoiceDate) : new Date(),
        dealerName: ocrData.invoice.dealerName || '',
        dealerAddress: ocrData.invoice.dealerAddress || '',
        buyerName: ocrData.invoice.buyerName || formData.ownerName,
        buyerAddress: ocrData.invoice.buyerAddress || formData.ownerAddress,
        paymentReference: ocrData.payment.paymentReference || '',
        paymentDate: ocrData.payment.paymentDate ? new Date(ocrData.payment.paymentDate) : new Date(),
        paidBy: ocrData.payment.paidBy || formData.ownerName,
        amountPaid: ocrData.payment.amountPaid || calculateTotal(),
        paymentPurpose: 'Motorbike Registration',
        bankName: ocrData.payment.bankName || '',
        bankBranch: ocrData.payment.bankBranch || '',
        status: 'PENDING',
        registeredByUserId: 0
      };
      console.log(registrationData);
      await registrationService.submitRegistration(registrationData);
      setSuccess(true);
      setStep(4);
    } catch (error) {
      setErrors(['Failed to submit registration. Please try again.']);
    } finally {
      setBtnLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Owner Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Name *
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter owner's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Address *
                </label>
                <textarea
                  value={formData.ownerAddress}
                  onChange={(e) => handleInputChange('ownerAddress', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter complete address"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <Car className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Motorbike Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Make *
                </label>
                <input
                  type="text"
                  value={formData.motorbikeMake}
                  onChange={(e) => handleInputChange('motorbikeMake', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Honda, Yamaha"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  value={formData.motorbikeModel}
                  onChange={(e) => handleInputChange('motorbikeModel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., CB 150F, YBR 125"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chassis Number *
                </label>
                <input
                  type="text"
                  value={formData.chassisNumber}
                  onChange={(e) => handleInputChange('chassisNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter chassis number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Engine Number *
                </label>
                <input
                  type="text"
                  value={formData.engineNumber}
                  onChange={(e) => handleInputChange('engineNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter engine number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Type *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="NORMAL"
                    checked={formData.registrationType === 'NORMAL'}
                    onChange={(e) => handleInputChange('registrationType', e.target.value as 'NORMAL' | 'SPECIAL')}
                    className="mr-2"
                  />
                  Normal Registration ({formatPrice(7000)})
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="SPECIAL"
                    checked={formData.registrationType === 'SPECIAL'}
                    onChange={(e) => handleInputChange('registrationType', e.target.value as 'NORMAL' | 'SPECIAL')}
                    className="mr-2"
                  />
                  Special Number (Premium Pricing)
                </label>
              </div>
            </div>

            {formData.registrationType === 'SPECIAL' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Number
                </label>
                <input
                  type="text"
                  value={formData.specialNumber || ''}
                  onChange={(e) => handleInputChange('specialNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter reserved special number (e.g., ABC-1111)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Only enter numbers you have already reserved from the Special Numbers section
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <FileText className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Document Upload (OCR Output)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Performa Invoice (OCR Text)
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload the OCR extracted text file from the invoice
                  </p>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('invoice', file);
                    }}
                    className="hidden"
                    id="invoice-upload"
                  />
                  <label
                    htmlFor="invoice-upload"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Choose File
                  </label>
                  {files.invoice && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {files.invoice.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Proof of Payment (OCR Text)
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload the OCR extracted text file from payment proof
                  </p>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('payment', file);
                    }}
                    className="hidden"
                    id="payment-upload"
                  />
                  <label
                    htmlFor="payment-upload"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Choose File
                  </label>
                  {files.payment && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {files.payment.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* OCR Data Preview */}
            {(Object.keys(ocrData.invoice).length > 0 || Object.keys(ocrData.payment).length > 0) && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Extracted Data Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  {Object.keys(ocrData.invoice).length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">From Invoice:</h5>
                      <ul className="space-y-1 text-gray-600">
                        {Object.entries(ocrData.invoice).map(([key, value]) => (
                          <li key={key}>
                            <span className="font-medium">{key}:</span> {String(value)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Object.keys(ocrData.payment).length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">From Payment:</h5>
                      <ul className="space-y-1 text-gray-600">
                        {Object.entries(ocrData.payment).map(([key, value]) => (
                          <li key={key}>
                            <span className="font-medium">{key}:</span> {String(value)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Total Calculation */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
                  <div>
                    <h4 className="text-lg font-medium text-blue-900">Registration Total</h4>
                    <p className="text-sm text-blue-700">
                      {formData.registrationType === 'SPECIAL' ? 'Special Number Premium' : 'Standard Registration Fee'}
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatPrice(calculateTotal())}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center py-12">
            {success ? (
              <>
                <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
                <p className="text-gray-600 mb-6">
                  Your motorbike registration has been submitted successfully. You will receive a confirmation email shortly.
                </p>
                <button
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      ownerName: '',
                      ownerAddress: '',
                      ownerEmail: '',
                      motorbikeMake: '',
                      motorbikeModel: '',
                      chassisNumber: '',
                      engineNumber: '',
                      registrationType: 'NORMAL',
                    });
                    setFiles({ invoice: null, payment: null });
                    setOcrData({ invoice: {}, payment: {} });
                    setSuccess(false);
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register Another Motorbike
                </button>
              </>
            ) : (
              <>
                <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Failed</h3>
                <p className="text-gray-600 mb-6">
                  There was an error processing your registration. Please try again.
                </p>
                <button
                  onClick={() => setStep(3)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">New Motorbike Registration</h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete all steps to register your motorbike
          </p>
        </div>

        {/* Current Info Card */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="bg-blue-600 rounded-lg p-4 text-white shadow-sm">
            <div className="flex flex-col space-y-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Current Registration Number
                </h3>
                <div className="text-3xl font-mono font-bold text-blue-600 tracking-tight">
                  {current?.numberPlate || 'Unavailable'}
                </div>
              </div>

              {current?.numberPlate && (
                <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-md">
                  <svg className="w-4 h-4 mr-1.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  This number is currently reserved for you
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                <div className="bg-gray-50 px-3 py-2 rounded-md">
                  <span className="font-medium text-gray-700 block mb-1">Price</span>
                  <span className="text-gray-900 font-mono">{current ? formatPrice(current.price) : '-'}</span>
                </div>
                <div className="bg-gray-50 px-3 py-2 rounded-md">
                  <span className="font-medium text-gray-700 block mb-1">Category</span>
                  <span className="text-gray-900">{current?.numberCategory || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${step >= stepNumber
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-600'
                    }`}
                >
                  {stepNumber}
                </div>
                <div
                  className={`ml-2 text-sm font-medium ${step >= stepNumber ? 'text-blue-600' : 'text-gray-500'
                    }`}
                >
                  {stepNumber === 1 && 'Owner Info'}
                  {stepNumber === 2 && 'Motorbike Info'}
                  {stepNumber === 3 && 'Documents'}
                  {stepNumber === 4 && 'Complete'}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-200">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <h4 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h4>
            </div>
            <ul className="mt-2 text-sm text-red-700 space-y-1 pl-5">
              {errors.map((error, index) => (
                <li key={index} className="list-disc">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Form Content */}
        <div className="px-6 py-8 bg-white">
          {renderStep()}
        </div>

        {/* Navigation */}
        {step < 4 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className={`px-4 py-2 rounded-md ${step === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              Previous
            </button>
            <div className="flex space-x-3">
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={btnLoading}
                  className={`px-6 py-2 rounded-md shadow-sm ${btnLoading
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                    } text-white transition-colors`}
                >
                  {btnLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Registration'
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewRegistrationForm;