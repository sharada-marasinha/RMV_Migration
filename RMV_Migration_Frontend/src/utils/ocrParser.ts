import { OCRData } from '../types';

export const parseInvoiceFile = (text: string): Partial<OCRData> => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  const data: Partial<OCRData> = {};

  lines.forEach(line => {
    const lowerLine = line.toLowerCase();

    if (lowerLine.includes('dealer name:')) {
      data.dealerName = extractValue(line);
    } else if (lowerLine.includes('dealer address:')) {
      data.dealerAddress = extractValue(line);
    } else if (lowerLine.includes('invoice number:')) {
      data.invoiceNumber = extractValue(line);
    } else if (lowerLine.includes('invoice date:')) {
      data.invoiceDate = extractValue(line);
    } else if (lowerLine.includes('buyer name:')) {
      data.buyerName = extractValue(line);
    } else if (lowerLine.includes('buyer address:')) {
      data.buyerAddress = extractValue(line);
    } else if (lowerLine.includes('motorbike make:')) {
      data.motorbikeMake = extractValue(line);
    } else if (lowerLine.includes('motorbike model:')) {
      data.motorbikeModel = extractValue(line);
    } else if (lowerLine.includes('chassis number:')) {
      data.chassisNumber = extractValue(line);
    } else if (lowerLine.includes('engine number:')) {
      data.engineNumber = extractValue(line);
    } else if (lowerLine.includes('total amount:')) {
      const amount = extractValue(line).replace(/[^\d.]/g, '');
      data.totalAmount = parseFloat(amount) || 0;
    } else if (lowerLine.includes('delivery date:')) {
      data.deliveryDate = extractValue(line);
    }
  });

  return data;
};

export const parsePaymentFile = (text: string): Partial<OCRData> => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  const data: Partial<OCRData> = {};

  lines.forEach(line => {
    const lowerLine = line.toLowerCase();

    if (lowerLine.includes('bank name:')) {
      data.bankName = extractValue(line);
    } else if (lowerLine.includes('branch:')) {
      data.bankBranch = extractValue(line);
    } else if (lowerLine.includes('payment date:')) {
      data.paymentDate = extractValue(line);
    } else if (lowerLine.includes('payment reference:')) {
      data.paymentReference = extractValue(line);
    } else if (lowerLine.includes('paid by:')) {
      data.paidBy = extractValue(line);
    } else if (lowerLine.includes('amount paid:')) {
      const amount = extractValue(line).replace(/[^\d.]/g, '');
      data.amountPaid = parseFloat(amount) || 0;
    } else if (lowerLine.includes('payment purpose:')) {
      data.paymentPurpose = extractValue(line);
    }
  });

  return data;
};

const extractValue = (line: string): string => {
  const colonIndex = line.indexOf(':');
  if (colonIndex !== -1) {
    return line.substring(colonIndex + 1).trim();
  }
  return '';
};

export const validateOCRData = (invoiceData: Partial<OCRData>, paymentData: Partial<OCRData>): string[] => {
  const errors: string[] = [];


  if (invoiceData.buyerName && paymentData.paidBy && invoiceData.buyerName !== paymentData.paidBy) {
    errors.push('Buyer name from invoice does not match paid by from payment proof');
  }




  if (paymentData.amountPaid && paymentData.amountPaid < 5000) {
    errors.push('Payment amount seems too low for registration fee');
  }


  if (!invoiceData.motorbikeMake) {
    errors.push('Motorbike make not found in invoice');
  }
  if (!invoiceData.motorbikeModel) {
    errors.push('Motorbike model not found in invoice');
  }
  if (!invoiceData.chassisNumber) {
    errors.push('Chassis number not found in invoice');
  }
  if (!invoiceData.engineNumber) {
    errors.push('Engine number not found in invoice');
  }
  if (!paymentData.paymentReference) {
    errors.push('Payment reference not found in payment proof');
  }

  return errors;
};