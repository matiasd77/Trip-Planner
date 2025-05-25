package PlanifikuesInteraktiviUdhetimeve.DTO;

import lombok.*;

@Data

@Getter
@Setter
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String password;

    public UserDTO(Long id, String name, String email, String role,String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.password= password;
    }

    public UserDTO() {
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

