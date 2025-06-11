package edu.rmv.service;

import edu.rmv.entity.MotorbikeRegistration;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class DocumentParsingService {

    public MotorbikeRegistration parseDocuments(String performaInvoice, String proofOfPayment) {
        MotorbikeRegistration registration = new MotorbikeRegistration();
        parsePerformaInvoice(registration, performaInvoice);

        parseProofOfPayment(registration, proofOfPayment);

        return registration;
    }

    private void parsePerformaInvoice(MotorbikeRegistration registration, String invoiceText) {

        registration.setInvoiceNumber("INV-" + System.currentTimeMillis());
        registration.setInvoiceDate(LocalDate.now());
        registration.setTotalAmount(new BigDecimal("150000"));
        registration.setDeliveryDate(LocalDate.now().minusDays(5));

        registration.setMotorbikeMake("Honda");
        registration.setMotorbikeModel("CB125F");
        registration.setChassisNumber("CH" + System.currentTimeMillis());
        registration.setEngineNumber("EN" + System.currentTimeMillis());

        registration.setDealerName("ABC Motors");
        registration.setDealerAddress("123 Main Street, Colombo");
    }

    private void parseProofOfPayment(MotorbikeRegistration registration, String paymentProof) {
        registration.setPaymentReference("PAY-" + System.currentTimeMillis());
        registration.setPaymentDate(LocalDate.now().minusDays(1));
        registration.setAmountPaid(new BigDecimal("7000"));
        registration.setPaymentPurpose("Motorbike Registration Fee");
        registration.setBankName("Commercial Bank");
        registration.setBankBranch("Colombo 03");
    }
}
