package PlanifikuesInteraktiviUdhetimeve.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForecastDTO {
    private String cityName;
    private String country;
    private String timezone;
    private List<DailyForecastDTO> dailyForecasts;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyForecastDTO {
        private Long timestamp;
        private Double temperature;
        private Double feelsLike;
        private Integer humidity;
        private String description;
        private Double windSpeed;
        private String icon;
        private String dateText;

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
}
