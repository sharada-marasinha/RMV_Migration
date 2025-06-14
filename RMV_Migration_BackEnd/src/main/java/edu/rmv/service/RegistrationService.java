package edu.rmv.service;

import edu.rmv.entity.MotorbikeRegistration;
import edu.rmv.entity.RegistrationNumber;
import edu.rmv.numberpool.PlateGenerator;
import edu.rmv.repository.impl.MotorbikeRegistrationDao;
import edu.rmv.repository.impl.RegistrationNumberDao;
import edu.rmv.util.NumberType;
import edu.rmv.util.RegistrationStatus;
import edu.rmv.util.SpecialCategory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RegistrationService {

    private final MotorbikeRegistrationDao registrationDao;
    private final RegistrationNumberDao numberDao;
    private final NumberGenerationService numberGenerationService;
    private final EmailService emailService;
    private final DocumentParsingService documentParsingService;

    public RegistrationService(MotorbikeRegistrationDao registrationDao,
                               RegistrationNumberDao numberDao,
                               NumberGenerationService numberGenerationService,
                               EmailService emailService,
                               DocumentParsingService documentParsingService) {
        this.registrationDao = registrationDao;
        this.numberDao = numberDao;
        this.numberGenerationService = numberGenerationService;
        this.emailService = emailService;
        this.documentParsingService = documentParsingService;
    }

    public MotorbikeRegistration registerMotorbike(MotorbikeRegistration registration, Long userId) {
        registration.setRegisteredByUserId(userId);
        registration.setRegisteredAt(LocalDateTime.now());
        registration.setUpdatedAt(LocalDateTime.now());

        RegistrationNumber registrationNumber = numberGenerationService.bookNumberPlate(
                new RegistrationNumber(
                        registration.getRegistrationNumber(),
                        registration.getRegistrationType(),
                        PlateGenerator.findSpacialCategory(registration.getRegistrationNumber()),
                        registration.getRegistrationFee()
                )
        );
        if (registrationNumber == null) {
            throw new RuntimeException("Registration number is not available or invalid");
        }

//        (String numberPlate, NumberType numberType, SpecialCategory specialCategory, BigDecimal price

//        if ("NORMAL".equalsIgnoreCase(registration.getRegistrationType())) {
//            String normalNumber = numberGenerationService.generateNextNormalNumber();
//            registration.setRegistrationNumber(normalNumber);
//            registration.setRegistrationFee(new BigDecimal("7000"));
//        } else if ("SPECIAL".equalsIgnoreCase(registration.getRegistrationType())) {
//            Optional<RegistrationNumber> specialNumber = numberDao.findByNumber(registration.getRegistrationNumber());
//            if (specialNumber.isPresent() && specialNumber.get().isLocked() &&
//                    specialNumber.get().getLockedByUserId().equals(userId)) {
//                registration.setRegistrationFee(specialNumber.get().getPrice());
//                numberDao.markAsUsed(registration.getRegistrationNumber());
//            } else {
//                throw new RuntimeException("Special number not available or not locked by user");
//            }
//        }

//        registration.setStatus(RegistrationStatus.COMPLETED);
        MotorbikeRegistration savedRegistration = registrationDao.save(registration);

        emailService.sendRegistrationConfirmation(savedRegistration);

        return savedRegistration;
    }

    public List<MotorbikeRegistration> getRegistrationsByUser(Long userId) {
        return registrationDao.findByUserId(userId);
    }

    public Optional<MotorbikeRegistration> getRegistrationById(Long id) {
        return registrationDao.findById(id);
    }

    public List<MotorbikeRegistration> getAllRegistrations() {
        return registrationDao.findAll();
    }

    public String getCurrentNormalNumber() {
        return numberDao.getCurrentNumber();
    }

    public List<RegistrationNumber> getAvailableSpecialNumbers() {
        numberDao.releaseExpiredLocks();
        return numberDao.findAvailableSpecialNumbers();
    }

    public boolean lockSpecialNumber(String number, Long userId) {
        return numberDao.lockNumber(number, userId);
    }

    public MotorbikeRegistration parseAndCreateRegistration(String performaInvoice, String proofOfPayment) {
        return documentParsingService.parseDocuments(performaInvoice, proofOfPayment);
    }
}