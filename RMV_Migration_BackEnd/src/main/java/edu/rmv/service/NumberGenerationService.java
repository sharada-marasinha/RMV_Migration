package edu.rmv.service;

import edu.rmv.dto.NumberPlate;
import edu.rmv.entity.RegistrationNumber;
import edu.rmv.numberpool.PlateGenerator;
import edu.rmv.repository.impl.RegistrationNumberDao;
import edu.rmv.util.NumberType;
import edu.rmv.util.SpecialCategory;
import edu.rmv.validator.RegistrationNumberValidator;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NumberGenerationService {

    private final RegistrationNumberDao numberDao;

    public NumberGenerationService(RegistrationNumberDao numberDao) {
        this.numberDao = numberDao;
    }

    public String generateNextNormalNumber() {
        String currentNumber = numberDao.getCurrentNumber();
        String nextNumber = incrementNumber(currentNumber);

        RegistrationNumber regNumber = new RegistrationNumber(
                nextNumber,
                NumberType.NORMAL,
                SpecialCategory.NORMAL,
                new BigDecimal("7000")
        );
        regNumber.setAvailable(false);
        numberDao.save(regNumber);

        return nextNumber;
    }

    private String incrementNumber(String currentNumber) {
        if (currentNumber.equals("ABC-0000")) {
            return "ABC-0001";
        }

        String[] parts = currentNumber.split("-");
        String prefix = parts[0];
        int number = Integer.parseInt(parts[1]);

        number++;

        if (number > 9999) {
            prefix = incrementPrefix(prefix);
            number = 1;
        }

        return String.format("%s-%04d", prefix, number);
    }

    private String incrementPrefix(String prefix) {
        char[] chars = prefix.toCharArray();

        for (int i = chars.length - 1; i >= 0; i--) {
            if (chars[i] < 'Z') {
                chars[i]++;
                break;
            } else {
                chars[i] = 'A';
                if (i == 0) {
                    return "AAA";
                }
            }
        }

        return new String(chars);
    }

    public List<Map<String, Object>> getAllAvailableSpecialNumbersWithPricing() {
        List<RegistrationNumber> specials = numberDao.findAvailableSpecialNumbers();

        return specials.stream().map(num -> {
            Map<String, Object> map = new HashMap<>();
            map.put("number", num.getNumber());
            map.put("category", num.getCategory().name());
            map.put("price", num.getPrice());
            return map;
        }).collect(Collectors.toList());
    }

    public NumberPlate getCurrentNumberPlate() {
        String nextPlate = PlateGenerator.generateNextNormalNumber(numberDao.getCurrentNumber());
        NumberPlate numberPlate = new NumberPlate();
        numberPlate.setNumberPlate(nextPlate);
        numberPlate.setPrice(PlateGenerator.calculateSpecialNumberFee(nextPlate));
        numberPlate.setCategory(RegistrationNumberValidator.detectNumberType(nextPlate));
        numberPlate.setSpecialCategory(PlateGenerator.findSpacialCategory(nextPlate));
        PlateGenerator.findSpacialCategory(nextPlate);
        return numberPlate;
    }

    public void initializeSpecialNumbers() {
        Map<SpecialCategory, BigDecimal> categoryPrices = new HashMap<>();
        categoryPrices.put(SpecialCategory.MILESTONE, new BigDecimal("10000"));
        categoryPrices.put(SpecialCategory.ONE_REPETITION, new BigDecimal("20000"));
        categoryPrices.put(SpecialCategory.TWO_REPETITIONS, new BigDecimal("30000"));
        categoryPrices.put(SpecialCategory.FULL_REPETITION, new BigDecimal("50000"));

        for (Map.Entry<SpecialCategory, BigDecimal> entry : categoryPrices.entrySet()) {
            SpecialCategory category = entry.getKey();
            BigDecimal price = entry.getValue();

            String exampleNumber = getExampleNumberForCategory(category);

            RegistrationNumber regNumber = new RegistrationNumber(
                    exampleNumber,
                    NumberType.SPECIAL,
                    category,
                    price
            );
            regNumber.setAvailable(true);
            numberDao.save(regNumber);
        }
    }

    private String getExampleNumberForCategory(SpecialCategory category) {
        switch (category) {
            case MILESTONE:
                return "ABC-1000";
            case ONE_REPETITION:
                return "AAB-1234";
            case TWO_REPETITIONS:
                return "AAB-1123";
            case FULL_REPETITION:
                return "AAA-1111";
            default:
                return "AAA-0001";
        }
    }


    public RegistrationNumber addRegistrationNumber(RegistrationNumber registrationNumber) {
        SpecialCategory category = RegistrationNumberValidator.validateSpecialCategory(registrationNumber.getNumber());

        NumberType type = (category == SpecialCategory.NORMAL)
                ? NumberType.NORMAL
                : NumberType.SPECIAL;

        registrationNumber.setNumberType(type);
        registrationNumber.setCategory(category);

        if (registrationNumber.getPrice() == null || registrationNumber.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            registrationNumber.setPrice(getPriceForCategory(category));
        }

        registrationNumber.setAvailable(true);
        registrationNumber.setLocked(false);
        registrationNumber.setLockExpiresAt(null);
        registrationNumber.setLockedByUserId(null);
        registrationNumber.setCreatedAt(LocalDateTime.now());
        registrationNumber.setUpdatedAt(LocalDateTime.now());

        return numberDao.save(registrationNumber);
    }


    public BigDecimal getPriceForCategory(SpecialCategory category) {
        switch (category) {
            case NORMAL:
                return new BigDecimal("7000");
            case MILESTONE:
                return new BigDecimal("10000");
            case ONE_REPETITION:
                return new BigDecimal("20000");
            case TWO_REPETITIONS:
                return new BigDecimal("30000");
            case FULL_REPETITION:
                return new BigDecimal("50000");
            case CHARACTER_BUMP:
                return new BigDecimal("100000");
            default:
                return new BigDecimal("7000");
        }
    }


    public RegistrationNumber bookNumberPlate(RegistrationNumber numberPlate) {
//        RegistrationNumberValidator.validateNumberPlateFormat(numberPlate.getNumberPlate());
        Optional<RegistrationNumber> existingNumber = numberDao.findByNumber(numberPlate.getNumber());
        System.out.println(existingNumber.isPresent() ? "Number already exists" : "Number is available");
        if (existingNumber.isPresent()) {
            throw new IllegalArgumentException("This number plate is already booked.");
        } else {
            SpecialCategory spacialCategory = PlateGenerator.findSpacialCategory(numberPlate.getNumber());
            if (spacialCategory != null) {
                String currentNormalNumber = numberDao.getCurrentNormalNumber();
                if (currentNormalNumber!= null && !currentNormalNumber.isEmpty()) {
                    String nextNormalNumber = PlateGenerator.generateNextNormalNumber(currentNormalNumber);
                    numberPlate.setNumber(nextNormalNumber);
                } else {
                    numberPlate.setNumber("ABC-0001");
                }
            }
            System.out.println(numberPlate);
            return numberDao.save(numberPlate);
        }
    }

    public String charBounce(String input) {
        return PlateGenerator.getRightSideBouncedPlate(input);
    }
}