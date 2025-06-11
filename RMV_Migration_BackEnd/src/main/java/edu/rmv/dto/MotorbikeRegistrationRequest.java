package edu.rmv.dto;


import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;


import java.time.LocalDate;

@Getter
@Setter
public class MotorbikeRegistrationRequest {

    // Owner Information
    @NotBlank(message = "Owner name is required")
    @Size(max = 100, message = "Owner name must be less than 100 characters")
    private String ownerName;

    @NotBlank(message = "Owner address is required")
    @Size(max = 200, message = "Owner address must be less than 200 characters")
    private String ownerAddress;

    @NotBlank(message = "Owner email is required")
    @Email(message = "Email should be valid")
    private String ownerEmail;

    // Motorbike Information
    @NotBlank(message = "Chassis number is required")
    @Size(min = 10, max = 20, message = "Chassis number must be between 10-20 characters")
    private String chassisNumber;

    @NotBlank(message = "Engine number is required")
    @Size(min = 10, max = 20, message = "Engine number must be between 10-20 characters")
    private String engineNumber;

    @NotBlank(message = "Make is required")
    @Size(max = 50, message = "Make must be less than 50 characters")
    private String make;

    @NotBlank(message = "Model is required")
    @Size(max = 50, message = "Model must be less than 50 characters")
    private String model;

    @NotNull(message = "Purchase date is required")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate purchaseDate;

    // Registration Type
    @NotBlank(message = "Registration type is required")
    @Pattern(regexp = "normal|special", flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "Registration type must be either 'normal' or 'special'")
    private String registrationType;

    // Special Number (required only if registrationType is 'special')
    @Size(min = 8, max = 8, message = "Special number must be in format ABC-1234")
    @Pattern(regexp = "[A-Z]{3}-\\d{4}", message = "Special number must match format ABC-1234")
    private String specialNumber;

    // Document Paths
    @NotBlank(message = "Performa invoice file path is required")
    private String performaInvoicePath;

    @NotBlank(message = "Proof of payment file path is required")
    private String proofOfPaymentPath;

    // Validation method for special number
    public boolean isSpecialNumberRequired() {
        return "special".equalsIgnoreCase(registrationType);
    }
}
