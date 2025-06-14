package edu.rmv.entity;

import edu.rmv.util.NumberType;
import edu.rmv.util.RegistrationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@ToString
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MotorbikeRegistration {
    private Long id;
    private String registrationNumber;
    private String ownerName;
    private String ownerAddress;
    private String ownerEmail;
    private String motorbikeMake;
    private String motorbikeModel;
    private String chassisNumber;
    private String engineNumber;
    private BigDecimal totalAmount;
    private NumberType registrationType;
    private BigDecimal registrationFee;
    private LocalDate deliveryDate;
    private String invoiceNumber;
    private LocalDate invoiceDate;
    private String dealerName;
    private String dealerAddress;
    private String buyerName;
    private String buyerAddress;
    private String paymentReference;
    private LocalDate paymentDate;
    private String paidBy;
    private BigDecimal amountPaid;
    private String paymentPurpose;
    private String bankName;
    private String bankBranch;
    private RegistrationStatus status = RegistrationStatus.PENDING;
    private Long registeredByUserId;
    private LocalDateTime registeredAt;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
