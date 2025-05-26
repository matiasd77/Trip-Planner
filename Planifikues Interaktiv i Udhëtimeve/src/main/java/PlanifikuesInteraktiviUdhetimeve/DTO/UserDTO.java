package PlanifikuesInteraktiviUdhetimeve.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String role; // Keep as String to accept from frontend
    private String password;
    private String phone;
    private String address;
    private UserPreferences preferences;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserPreferences {
        private String language;
        private String currency;
        private boolean notifications;
    }
}
