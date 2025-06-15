package edu.rmv.entity;

import edu.rmv.util.NumberCategory;
import edu.rmv.util.NumberType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@ToString
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationNumber {
    private Long id;
    private String number;
    private NumberType numberType;
    private NumberCategory category;
    private BigDecimal price;
    private Boolean available;
    private Boolean isLocked;
    private LocalDateTime lockExpiresAt;
    private Long lockedByUserId;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public RegistrationNumber(String numberPlate, NumberType numberType, NumberCategory numberCategory, BigDecimal price) {
        this.number = numberPlate;
        this.numberType = numberType;
        this.category = numberCategory;
        this.price = price;
        this.isLocked = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

}