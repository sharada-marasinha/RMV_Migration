package edu.rmv.entity;

import edu.rmv.util.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class User {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String fullName;
    private UserRole role = UserRole.USER;
    private Boolean isActive = true;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public User(@NotBlank @Size(min = 3, max = 20) String username, @NotBlank @Email String email, @NotBlank @Size(min = 6, max = 40) String password, @NotBlank String fullName, UserRole userRole) {
    this.username=username;
    this.email=email;
    this.password=password;
    this.fullName=fullName;
    this.role = userRole;
    this.isActive = true;
    }

    public boolean isActive() {
        return isActive;
    }
}