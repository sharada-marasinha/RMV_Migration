package edu.rmv.validator;

import edu.rmv.util.NumberCategory;

public class RegistrationNumberValidator {

    public static NumberCategory validateSpecialCategory(String number) {
        if (!number.matches("^[A-Z]{3}-\\d{4}$")) {
            throw new IllegalArgumentException("Invalid registration number format");
        }

        String[] parts = number.split("-");
        String prefix = parts[0];
        String digits = parts[1];

        // Milestone: ends in 1000, 2000, ..., 9000
        if (digits.matches("^(1000|2000|3000|4000|5000|6000|7000|8000|9000)$")) {
            return NumberCategory.MILESTONE;
        }

        // Full repetition: 1111, 2222, ...
        if (digits.matches("^(\\d)\\1{3}$")) {
            return NumberCategory.FULL_REPETITION;
        }

        // Two repetitions: 1122, 1212, 1221, 2112, etc. (2 distinct digits repeated)
        if (digits.matches("^(\\d)\\1(\\d)\\2$")) {
            return NumberCategory.TWO_REPETITIONS;
        }

        // One repetition: 1100, 1223, etc.
        if (digits.matches("^(\\d)\\1\\d{2}$") || digits.matches("^\\d{2}(\\d)\\1$")) {
            return NumberCategory.ONE_REPETITION;
        }

        // Character bump: if prefix > "AAA"
        if (prefix.compareTo("AAA") > 0) {
            return NumberCategory.CHARACTER_BUMP;
        }

        return NumberCategory.NORMAL;
    }

}
