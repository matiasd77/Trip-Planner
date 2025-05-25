package PlanifikuesInteraktiviUdhetimeve.DTO;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class TransportDTO {
    private Long id;
    private String type;
    private String company;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Long tripId;

    public TransportDTO() {
    }

    public TransportDTO(Long id, String type, String company, LocalDateTime departureTime, LocalDateTime arrivalTime, Long tripId) {
        this.id = id;
        this.type = type;
        this.company = company;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.tripId = tripId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }
}


