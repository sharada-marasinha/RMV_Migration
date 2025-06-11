package edu.rmv.controller;

import edu.rmv.dto.NumberPlate;
import edu.rmv.entity.RegistrationNumber;
import edu.rmv.service.NumberGenerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/number-plates")
public class NumberPlateController {
    private final NumberGenerationService service;
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


}
