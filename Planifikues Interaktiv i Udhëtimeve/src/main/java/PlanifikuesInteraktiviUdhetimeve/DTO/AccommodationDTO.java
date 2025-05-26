package PlanifikuesInteraktiviUdhetimeve.DTO;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
public class AccommodationDTO {
    private Long id;
    private String name;
    private String description;
    private String location;
    private Double price;
    private Integer rating;
    private String type;
    private String amenities;
    private String checkIn;
    private String checkOut;
    private Long tripId;

    public AccommodationDTO() {
    }

    // All args constructor
    public AccommodationDTO(Long id, String name, String description, String location, Double price, 
                          Integer rating, String type, List<String> amenities, String checkIn, 
                          String checkOut, Long tripId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.price = price;
        this.rating = rating;
        this.type = type;
        this.amenities = amenities != null ? String.join(",", amenities) : "";
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.tripId = tripId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public List<String> getAmenities() {
        return amenities != null ? List.of(amenities.split(",")) : List.of();
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities != null ? String.join(",", amenities) : "";
    }

    public String getCheckIn() { return checkIn; }
    public void setCheckIn(String checkIn) { this.checkIn = checkIn; }

    public String getCheckOut() { return checkOut; }
    public void setCheckOut(String checkOut) { this.checkOut = checkOut; }

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }
}
