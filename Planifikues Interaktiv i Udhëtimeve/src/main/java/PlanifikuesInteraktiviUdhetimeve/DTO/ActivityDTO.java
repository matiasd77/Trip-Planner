package PlanifikuesInteraktiviUdhetimeve.DTO;

import lombok.*;
import java.time.LocalDate;

@Data

@Getter
@Setter
public class ActivityDTO {
    private Long id;
    private String name;
    private String location;
    private LocalDate date;
    private Long tripId;

    public ActivityDTO(Long id, String name, String location, LocalDate date, Long tripId) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.date = date;
        this.tripId = tripId;
    }

    public ActivityDTO() {
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }
}
