package edu.rmv.controller;

import edu.rmv.dto.RegisterRequest;
import edu.rmv.entity.MotorbikeRegistration;
import edu.rmv.entity.RegistrationNumber;
import edu.rmv.entity.User;
import edu.rmv.numberpool.PlateGenerator;
import edu.rmv.service.NumberGenerationService;
import edu.rmv.service.RegistrationService;
import edu.rmv.service.UserService;
import edu.rmv.validator.RegistrationNumberValidator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;
    private final UserService userService;
    private final NumberGenerationService numberGenerationService;

    @PostMapping
    public ResponseEntity<?> createRegistration(@Valid @RequestBody MotorbikeRegistration registration,
                                                Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName()).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            System.out.println(registration);
            MotorbikeRegistration savedRegistration = registrationService.registerMotorbike(registration, user.getId());

            return ResponseEntity.ok(savedRegistration);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<MotorbikeRegistration>> getUserRegistrations(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        List<MotorbikeRegistration> registrations = registrationService.getRegistrationsByUser(user.getId());
        return ResponseEntity.ok(registrations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MotorbikeRegistration> getRegistration(@PathVariable Long id) {
        return registrationService.getRegistrationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping("/admin/registration-numbers")
    public RegistrationNumber addRegistrationNumber(@RequestBody RegistrationNumber registrationNumber) {
        BigDecimal price = registrationNumber.getPrice() != null
                ? registrationNumber.getPrice()
                : PlateGenerator.calculateSpecialNumberFee(registrationNumber.getNumber());
        registrationNumber.setPrice(price);
        RegistrationNumber saved = numberGenerationService.addRegistrationNumber(
                registrationNumber
        );
        return saved;
    }
}