package PlanifikuesInteraktiviUdhetimeve.DTO;
import lombok.*;
import java.time.LocalDate;

@Data
public class AccommodationDTO {
    private Long id;
    private String name;
    private String address;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Long tripId;

    public AccommodationDTO(Long id, String name, String address, LocalDate checkIn, LocalDate checkOut, Long tripId) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.tripId = tripId;
    }

    public AccommodationDTO() {
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(LocalDate checkIn) {
        this.checkIn = checkIn;
    }

    public LocalDate getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(LocalDate checkOut) {
        this.checkOut = checkOut;
    }

    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }
}

