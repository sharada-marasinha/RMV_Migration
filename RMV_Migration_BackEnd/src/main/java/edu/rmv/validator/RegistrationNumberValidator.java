package edu.rmv.validator;

import edu.rmv.util.NumberType;
import edu.rmv.util.SpecialCategory;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

public class RegistrationNumberValidator {

    public static SpecialCategory validateSpecialCategory(String number) {
        if (!number.matches("^[A-Z]{3}-\\d{4}$")) {
            throw new IllegalArgumentException("Invalid registration number format");
        }

        String[] parts = number.split("-");
        String prefix = parts[0];
        String digits = parts[1];

        // Milestone: ends in 1000, 2000, ..., 9000
        if (digits.matches("^(1000|2000|3000|4000|5000|6000|7000|8000|9000)$")) {
            return SpecialCategory.MILESTONE;
        }

        // Full repetition: 1111, 2222, ...
        if (digits.matches("^(\\d)\\1{3}$")) {
            return SpecialCategory.FULL_REPETITION;
        }

        // Two repetitions: 1122, 1212, 1221, 2112, etc. (2 distinct digits repeated)
        if (digits.matches("^(\\d)\\1(\\d)\\2$")) {
            return SpecialCategory.TWO_REPETITIONS;
        }

        // One repetition: 1100, 1223, etc.
        if (digits.matches("^(\\d)\\1\\d{2}$") || digits.matches("^\\d{2}(\\d)\\1$")) {
            return SpecialCategory.ONE_REPETITION;
        }

        // Character bump: if prefix > "AAA"
        if (prefix.compareTo("AAA") > 0) {
            return SpecialCategory.CHARACTER_BUMP;
        }

        return SpecialCategory.NORMAL;
    }

    public static NumberType detectNumberType(String number) {
        SpecialCategory category = validateSpecialCategory(number);
        System.out.println(category);
        return (category == SpecialCategory.NORMAL)
                ? NumberType.NORMAL
                : NumberType.SPECIAL;
    }

}
