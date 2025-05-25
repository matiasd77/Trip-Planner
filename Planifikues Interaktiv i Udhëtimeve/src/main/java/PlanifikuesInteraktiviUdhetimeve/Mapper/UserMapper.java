package PlanifikuesInteraktiviUdhetimeve.Mapper;

import PlanifikuesInteraktiviUdhetimeve.DTO.UserDTO;
import PlanifikuesInteraktiviUdhetimeve.Entity.User;
import PlanifikuesInteraktiviUdhetimeve.Entity.Role;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        return new UserDTO(
            user.getId(), 
            user.getName(), 
            user.getEmail(), 
            user.getRole().name(),
            user.getPassword()
        );
    }

    public static User toEntity(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setRole(Role.valueOf(dto.getRole().toUpperCase()));
        user.setPassword(dto.getPassword());
        return user;
    }
}
