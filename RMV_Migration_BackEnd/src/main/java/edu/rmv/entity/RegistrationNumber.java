package edu.rmv.entity;

import edu.rmv.util.NumberType;
import edu.rmv.util.SpecialCategory;
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
    private SpecialCategory category;
    private BigDecimal price;
    private Boolean available;
    private Boolean isLocked;
    private LocalDateTime lockExpiresAt;
    private Long lockedByUserId;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public RegistrationNumber(String numberPlate, NumberType numberType, SpecialCategory specialCategory, BigDecimal price) {
        this.number = numberPlate;
        this.numberType = numberType;
        this.category = specialCategory;
        this.price = price;
        this.available = false;
        this.isLocked = true;
    }



    public boolean isLocked() {
        return false;
    }

    public boolean isAvailable() {
        return true;
    }

    public void setLocked(boolean isLocked) {
    }
}