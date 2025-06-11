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
    private boolean available;
    private boolean locked;
    private LocalDateTime lockExpiresAt;
    private Long lockedByUserId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RegistrationNumber(String nextNumber, NumberType numberType, SpecialCategory specialCategory, BigDecimal bigDecimal) {
    }
}