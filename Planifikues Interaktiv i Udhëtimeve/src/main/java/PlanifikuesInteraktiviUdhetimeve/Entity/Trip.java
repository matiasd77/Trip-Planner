package PlanifikuesInteraktiviUdhetimeve.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data

public class Trip {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;

    public Trip() {
    }

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WeatherAlert> weatherAlerts = new ArrayList<>();

    // Helper methods for weather alerts
    public void addWeatherAlert(WeatherAlert alert) {
        weatherAlerts.add(alert);
        alert.setTrip(this);
    }

    public void removeWeatherAlert(WeatherAlert alert) {
        weatherAlerts.remove(alert);
        alert.setTrip(null);
    }

    public List<WeatherAlert> getActiveWeatherAlerts() {
        return weatherAlerts.stream()
                .filter(WeatherAlert::isActive)
                .toList();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Trip(Long id, String destination, LocalDate startDate, LocalDate endDate, User user) {
        this.id = id;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.user = user;
    }
}
