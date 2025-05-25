package PlanifikuesInteraktiviUdhetimeve.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import PlanifikuesInteraktiviUdhetimeve.DTO.WeatherDTO;
import PlanifikuesInteraktiviUdhetimeve.DTO.ForecastDTO;
import PlanifikuesInteraktiviUdhetimeve.Entity.WeatherAlert;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class WeatherService {
    private final WebClient webClient;
    private final String apiKey;

    public WeatherService(
            @Value("${weather.api.base-url}") String baseUrl,
            @Value("${weather.api.key}") String apiKey) {
        this.apiKey = apiKey;
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public Mono<WeatherDTO> getCurrentWeather(String city) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/weather")
                        .queryParam("q", city)
                        .queryParam("appid", apiKey)
                        .queryParam("units", "metric")
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .map(this::mapToWeatherDTO)
                .doOnError(error -> 
                    log.error("Error fetching weather data for city {}: {}", city, error.getMessage())
                );
    }

    public Mono<ForecastDTO> getForecast(String city, int days) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/forecast")
                        .queryParam("q", city)
                        .queryParam("appid", apiKey)
                        .queryParam("units", "metric")
                        .queryParam("cnt", days * 8) // 8 forecasts per day
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> mapToForecastDTO(response, days))
                .doOnError(error -> 
                    log.error("Error fetching forecast data for city {}: {}", city, error.getMessage())
                );
    }

    private WeatherDTO mapToWeatherDTO(Map<String, Object> response) {
        Map<String, Object> main = (Map<String, Object>) response.get("main");
        List<Map<String, Object>> weather = (List<Map<String, Object>>) response.get("weather");
        Map<String, Object> wind = (Map<String, Object>) response.get("wind");
        Map<String, Object> sys = (Map<String, Object>) response.get("sys");

        WeatherDTO dto = new WeatherDTO();
        dto.setTemperature(((Number) main.get("temp")).doubleValue());
        dto.setFeelsLike(((Number) main.get("feels_like")).doubleValue());
        dto.setHumidity(((Number) main.get("humidity")).intValue());
        dto.setDescription(weather.get(0).get("description").toString());
        dto.setIcon(weather.get(0).get("icon").toString());
        dto.setWindSpeed(((Number) wind.get("speed")).doubleValue());
        dto.setCityName(response.get("name").toString());
        dto.setCountry(sys.get("country").toString());
        dto.setTimestamp(((Number) response.get("dt")).longValue());

        return dto;
    }

    private ForecastDTO mapToForecastDTO(Map<String, Object> response, int days) {
        Map<String, Object> city = (Map<String, Object>) response.get("city");
        List<Map<String, Object>> list = (List<Map<String, Object>>) response.get("list");
        
        ForecastDTO dto = new ForecastDTO();
        dto.setCityName(city.get("name").toString());
        dto.setCountry(city.get("country").toString());
        dto.setTimezone(city.get("timezone").toString());
        
        List<ForecastDTO.DailyForecastDTO> dailyForecasts = new ArrayList<>();
        
        for (Map<String, Object> item : list) {
            Map<String, Object> main = (Map<String, Object>) item.get("main");
            List<Map<String, Object>> weather = (List<Map<String, Object>>) item.get("weather");
            Map<String, Object> wind = (Map<String, Object>) item.get("wind");
            
            ForecastDTO.DailyForecastDTO daily = new ForecastDTO.DailyForecastDTO();
            daily.setTimestamp(((Number) item.get("dt")).longValue());
            daily.setTemperature(((Number) main.get("temp")).doubleValue());
            daily.setFeelsLike(((Number) main.get("feels_like")).doubleValue());
            daily.setHumidity(((Number) main.get("humidity")).intValue());
            daily.setDescription(weather.get(0).get("description").toString());
            daily.setIcon(weather.get(0).get("icon").toString());
            daily.setWindSpeed(((Number) wind.get("speed")).doubleValue());
            daily.setDateText(item.get("dt_txt").toString());
            
            dailyForecasts.add(daily);
        }
        
        dto.setDailyForecasts(dailyForecasts);
        return dto;
    }

    public WeatherAlert createWeatherAlert(Trip trip, String alertType, String description, 
            String severity, LocalDateTime expiryTime) {
        WeatherAlert alert = new WeatherAlert();
        alert.setTrip(trip);
        alert.setAlertType(alertType);
        alert.setDescription(description);
        alert.setSeverity(severity);
        alert.setAlertTime(LocalDateTime.now());
        alert.setExpiryTime(expiryTime);
        alert.setCityName(trip.getDestination());
        alert.setAcknowledged(false);
        
        return alert;
    }

    public LocalDateTime timestampToLocalDateTime(long timestamp) {
        return LocalDateTime.ofInstant(
            Instant.ofEpochSecond(timestamp),
            ZoneId.systemDefault()
        );
    }
}
