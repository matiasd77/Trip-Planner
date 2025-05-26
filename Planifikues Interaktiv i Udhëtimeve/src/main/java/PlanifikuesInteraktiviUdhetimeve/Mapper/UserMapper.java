package PlanifikuesInteraktiviUdhetimeve.Mapper;

import PlanifikuesInteraktiviUdhetimeve.DTO.UserDTO;
import PlanifikuesInteraktiviUdhetimeve.Entity.User;
import PlanifikuesInteraktiviUdhetimeve.Entity.Role;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        UserDTO.UserPreferences preferences = null;
        if (user.getPreferences() != null) {
            preferences = new UserDTO.UserPreferences(
                user.getPreferences().getLanguage(),
                user.getPreferences().getCurrency(),
                user.getPreferences().isNotifications()
            );
        } else {
            preferences = new UserDTO.UserPreferences("en", "USD", true);
        }

        return UserDTO.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole().name())
            .password(user.getPassword())
            .phone(user.getPhone())
            .address(user.getAddress())
            .preferences(preferences)
            .build();
    }

    public static User toEntity(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setRole(Role.valueOf(dto.getRole().toUpperCase()));
        user.setPassword(dto.getPassword());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());
        
        if (dto.getPreferences() != null) {
            User.UserPreferences preferences = new User.UserPreferences(
                dto.getPreferences().getLanguage(),
                dto.getPreferences().getCurrency(),
                dto.getPreferences().isNotifications()
            );
            user.setPreferences(preferences);
        } else {
            user.setPreferences(new User.UserPreferences("en", "USD", true));
        }
        
        return user;
    }
}
