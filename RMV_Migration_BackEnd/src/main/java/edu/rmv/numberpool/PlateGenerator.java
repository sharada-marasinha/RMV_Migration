package edu.rmv.numberpool;

import edu.rmv.util.NumberCategory;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;


public class PlateGenerator {
    public static String generateNextNormalNumber(String lastNumber) {
        String nextNumber = lastNumber;

        do {
            nextNumber = incrementPlate(nextNumber);
        } while (findSpacialCategory(nextNumber) != NumberCategory.NORMAL);

        return nextNumber;
    }

    private static String incrementPlate(String plate) {
        if (plate == null || !plate.matches("[A-Z]{3}-\\d{4}")) {
            throw new IllegalArgumentException("Invalid plate format");
        }

        String letters = plate.substring(0, 3);
        String digits = plate.substring(4);

        int digitNum = Integer.parseInt(digits);
        digitNum++;
        if (digitNum > 9999) {
            digitNum = 0;
            letters = incrementLetters(letters);
        }

        return String.format("%s-%04d", letters, digitNum);
    }

    private static String incrementLetters(String letters) {
        char[] chars = letters.toCharArray();

        for (int i = chars.length - 1; i >= 0; i--) {
            if (chars[i] == 'Z') {
                chars[i] = 'A';
            } else {
                chars[i]++;
                return new String(chars);
            }
        }

        throw new IllegalStateException("Exceeded max plate 'ZZZ-9999'");
    }

    public static BigDecimal calculateSpecialNumberFee(String number) {
        String digits = number.split("-")[1];

        if (isFullRepetition(digits)) {
            return new BigDecimal("50000");
        } else if (isTwoRepetition(digits)) {
            return new BigDecimal("30000");
        } else if (isOneRepetition(digits)) {
            return new BigDecimal("20000");
        } else if (isMilestone(digits)) {
            return new BigDecimal("10000");
        } else if (isPalindrome(digits)) {
            return new BigDecimal("40000");
        } else if (isSequential(digits)) {
            return new BigDecimal("45000");
        }

        return new BigDecimal("7000");
    }

    private static boolean isFullRepetition(String digits) {
        return digits.chars().distinct().count() == 1;
    }

    private static boolean isTwoRepetition(String digits) {
        long count = digits.chars().distinct().count();
        return count == 2 && digits.length() == 4;
    }

    private static boolean isOneRepetition(String digits) {
        return digits.charAt(0) == digits.charAt(1) || digits.charAt(2) == digits.charAt(3);
    }

    private static boolean isMilestone(String digits) {
        return digits.endsWith("000") || digits.endsWith("0000");
    }

    private static boolean isPalindrome(String digits) {
        return new StringBuilder(digits).reverse().toString().equals(digits);
    }

    private static boolean isSequential(String digits) {
        return "1234".equals(digits) || "2345".equals(digits) || "3456".equals(digits);
    }

    public static NumberCategory findSpacialCategory(String plate) {
        if (plate == null || !plate.matches("[A-Z]{3}-\\d{4}")) {
            return NumberCategory.NORMAL; // fallback
        }

        String digits = plate.split("-")[1];

        if (digits.chars().distinct().count() == 1) {
            return NumberCategory.FULL_REPETITION;
        }

        if (digits.matches("(1000|2000|3000|4000|5000|6000|7000|8000|9000)")) {
            return NumberCategory.MILESTONE;
        }

        Map<Character, Integer> counts = new HashMap<>();
        for (char c : digits.toCharArray()) {
            counts.put(c, counts.getOrDefault(c, 0) + 1);
        }

        long repeatedDigits = counts.values().stream().filter(v -> v > 1).count();

        if (repeatedDigits == 2) {
            return NumberCategory.TWO_REPETITIONS;
        } else if (repeatedDigits == 1) {
            return NumberCategory.ONE_REPETITION;
        }

        return NumberCategory.NORMAL;
    }

    public static String getRightSideBouncedPlate(String currentPlate) {
        if (currentPlate == null || !currentPlate.matches("[A-Z]{3}-\\d{4}")) {
            throw new IllegalArgumentException("Invalid plate format. Expected format: AAA-0000");
        }

        String prefix = currentPlate.substring(0, 3);
        String digits = currentPlate.substring(4);

        char[] chars = prefix.toCharArray();

        for (int i = 2; i >= 0; i--) {
            if (chars[i] < 'Z') {
                chars[i]++;
                break;
            }
        }

        String bouncedPrefix = new String(chars);
        return bouncedPrefix + "-" + digits;
    }

}

