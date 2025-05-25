package PlanifikuesInteraktiviUdhetimeve.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data

public class Transport {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type;
    private String company;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;

    @ManyToOne
    private Trip trip;

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

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public Transport(Long id, String type, String company, LocalDateTime departureTime, LocalDateTime arrivalTime, Trip trip) {
        this.id = id;
        this.type = type;
        this.company = company;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.trip = trip;
    }

    public Transport() {
    }
}
