package edu.rmv.controller;

import edu.rmv.dto.NumberPlate;
import edu.rmv.entity.RegistrationNumber;
import edu.rmv.entity.User;
import edu.rmv.service.NumberGenerationService;
import edu.rmv.service.RegistrationService;
import edu.rmv.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/number-plates")
public class NumberPlateController {
    private final NumberGenerationService service;
    private final RegistrationService registrationService;
    private final UserService userService;

    @GetMapping("/current")
    public NumberPlate getCurrentNumberPlate() {
        return service.getCurrentNumberPlate();
    }

    @PostMapping("/book-number-plate")
    public RegistrationNumber bookNumberPlate(@RequestBody RegistrationNumber numberPlate) {
        return service.bookNumberPlate(numberPlate);
    }

    @PostMapping("/char-bounce/{input}")
    public String charBounce(@PathVariable String input) {
        return service.charBounce(input);
    }

    @GetMapping("/special-numbers")
    public ResponseEntity<List<RegistrationNumber>> getAvailableSpecialNumbers() {
        List<RegistrationNumber> numbers = registrationService.getAvailableSpecialNumbers();
        return ResponseEntity.ok(numbers);
    }

    @PostMapping("/lock-special-number/{number}")
    public ResponseEntity<?> lockSpecialNumber(@PathVariable String number, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        boolean locked = registrationService.lockSpecialNumber(number, user.getId());
        if (locked) {
            return ResponseEntity.ok("Number locked successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to lock number");
        }
    }

}
