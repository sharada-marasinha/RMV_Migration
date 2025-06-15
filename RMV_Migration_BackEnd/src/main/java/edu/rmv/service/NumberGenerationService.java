package edu.rmv.service;

import edu.rmv.dto.NumberPlate;
import edu.rmv.entity.RegistrationNumber;
import edu.rmv.numberpool.PlateGenerator;
import edu.rmv.repository.impl.RegistrationNumberDao;
import edu.rmv.util.NumberCategory;
import edu.rmv.util.NumberType;
import edu.rmv.validator.RegistrationNumberValidator;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class NumberGenerationService {

    private final RegistrationNumberDao numberDao;

    public NumberGenerationService(RegistrationNumberDao numberDao) {
        this.numberDao = numberDao;
    }

    public NumberPlate getCurrentNumberPlate() {
        String nextPlate = PlateGenerator.generateNextNormalNumber(numberDao.getCurrentNumber());
        NumberPlate numberPlate = new NumberPlate();
        numberPlate.setNumberPlate(nextPlate);
        numberPlate.setPrice(PlateGenerator.calculateSpecialNumberFee(nextPlate));
        numberPlate.setNumberCategory(PlateGenerator.findSpacialCategory(nextPlate));
        PlateGenerator.findSpacialCategory(nextPlate);

//        addRegistrationNumber(new RegistrationNumber(
//                numberPlate.getNumberPlate(),
//                NumberType.NORMAL,
//                numberPlate.getNumberCategory(),
//                getPriceForCategory(NumberCategory.NORMAL)
//        ));
        return numberPlate;
    }

    public RegistrationNumber addRegistrationNumber(RegistrationNumber registrationNumber) {
        NumberCategory category = RegistrationNumberValidator.validateSpecialCategory(registrationNumber.getNumber());

        NumberType type = (category == NumberCategory.NORMAL)
                ? NumberType.NORMAL
                : NumberType.SPECIAL;

        registrationNumber.setNumberType(type);
        registrationNumber.setCategory(category);

        if (registrationNumber.getPrice() == null || registrationNumber.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            registrationNumber.setPrice(getPriceForCategory(category));
        }
        registrationNumber.setAvailable(true);
        registrationNumber.setIsLocked(false);
        registrationNumber.setLockExpiresAt(null);
        registrationNumber.setLockedByUserId(null);
        registrationNumber.setCreatedAt(LocalDateTime.now());
        registrationNumber.setUpdatedAt(LocalDateTime.now());

        return numberDao.save(registrationNumber);
    }

    public BigDecimal getPriceForCategory(NumberCategory category) {
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
        Optional<RegistrationNumber> existingNumber = numberDao.findByNumber(numberPlate.getNumber());
        System.out.println(existingNumber.isPresent() ? "Number already exists" : "Number is available");
        if (existingNumber.isPresent()) {
            throw new IllegalArgumentException("This number plate is already booked.");
        } else {
            NumberCategory spacialCategory = PlateGenerator.findSpacialCategory(numberPlate.getNumber());
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