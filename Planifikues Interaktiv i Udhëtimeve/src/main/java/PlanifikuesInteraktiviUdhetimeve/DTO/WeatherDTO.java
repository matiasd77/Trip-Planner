package PlanifikuesInteraktiviUdhetimeve.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeatherDTO {
    private Double temperature;
    private Double feelsLike;
    private Integer humidity;
    private String description;
    private Double windSpeed;
    private String icon;
    private String cityName;
    private String country;
    private Long timestamp;
    
    // Custom getters for formatted data
    public String getFormattedTemperature() {
        return String.format("%.1f°C", temperature);
    }
    
    public String getFormattedWindSpeed() {
        return String.format("%.1f m/s", windSpeed);
    }
    
    public String getFormattedHumidity() {
        return humidity + "%";
    }
}
