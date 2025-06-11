package edu.rmv.dto;

import edu.rmv.util.NumberType;
import edu.rmv.util.SpecialCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NumberPlate {
    private String numberPlate;
    private BigDecimal price;
    private NumberType category;
    private SpecialCategory specialCategory;
}
