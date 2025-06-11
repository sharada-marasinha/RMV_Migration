package edu.rmv.service;

import edu.rmv.entity.MotorbikeRegistration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendRegistrationConfirmation(MotorbikeRegistration registration) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(registration.getOwnerEmail());
            message.setSubject("Motorbike Registration Confirmation - " + registration.getRegistrationNumber());
            message.setText(buildRegistrationConfirmationMessage(registration));
            message.setFrom("noreply@rmv.gov");

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    private String buildRegistrationConfirmationMessage(MotorbikeRegistration registration) {
        return String.format(
                "Dear %s,\n\n" +
                        "Your motorbike registration has been completed successfully.\n\n" +
                        "Registration Details:\n" +
                        "Registration Number: %s\n" +
                        "Motorbike: %s %s\n" +
                        "Chassis Number: %s\n" +
                        "Engine Number: %s\n" +
                        "Registration Fee: Rs. %.2f\n\n" +
                        "Thank you for using our services.\n\n" +
                        "Best regards,\n" +
                        "RMV Registration System",
                registration.getOwnerName(),
                registration.getRegistrationNumber(),
                registration.getMotorbikeMake(),
                registration.getMotorbikeModel(),
                registration.getChassisNumber(),
                registration.getEngineNumber(),
                registration.getRegistrationFee()
        );
    }
}
