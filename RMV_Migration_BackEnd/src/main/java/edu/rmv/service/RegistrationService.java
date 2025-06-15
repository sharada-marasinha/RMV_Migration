package edu.rmv.service;

import edu.rmv.entity.MotorbikeRegistration;
import edu.rmv.entity.RegistrationNumber;
import edu.rmv.numberpool.PlateGenerator;
import edu.rmv.repository.impl.MotorbikeRegistrationDao;
import edu.rmv.repository.impl.RegistrationNumberDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class RegistrationService {

    private final MotorbikeRegistrationDao registrationDao;
    private final RegistrationNumberDao numberDao;
    private final NumberGenerationService numberGenerationService;
    private final EmailService emailService;

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

    public List<RegistrationNumber> getAvailableSpecialNumbers() {
        numberDao.releaseExpiredLocks();
        return numberDao.findAvailableSpecialNumbers();
    }

    public boolean lockSpecialNumber(String number, Long userId) {
        return numberDao.lockNumber(number, userId);
    }

}