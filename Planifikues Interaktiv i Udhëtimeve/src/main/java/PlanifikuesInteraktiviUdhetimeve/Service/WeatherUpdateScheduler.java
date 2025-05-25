package PlanifikuesInteraktiviUdhetimeve.Service;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;
import PlanifikuesInteraktiviUdhetimeve.Entity.WeatherAlert;
import PlanifikuesInteraktiviUdhetimeve.Repository.TripRepository;
import PlanifikuesInteraktiviUdhetimeve.Repository.WeatherAlertRepository;
import PlanifikuesInteraktiviUdhetimeve.DTO.WeatherDTO;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Service
@EnableScheduling
@Slf4j
public class WeatherUpdateScheduler {

    private final TripRepository tripRepository;
    private final WeatherService weatherService;
    private final WeatherAlertRepository weatherAlertRepository;

    public WeatherUpdateScheduler(
            TripRepository tripRepository,
            WeatherService weatherService,
            WeatherAlertRepository weatherAlertRepository) {
        this.tripRepository = tripRepository;
        this.weatherService = weatherService;
        this.weatherAlertRepository = weatherAlertRepository;
    }

    @Scheduled(fixedRate = 3600000) // Every hour
    @Transactional
    public void updateWeatherForActiveTrips() {
        LocalDate now = LocalDate.now();
        List<Trip> activeTrips = tripRepository.findAll().stream()
                .filter(trip -> !trip.getStartDate().isBefore(now) && !trip.getEndDate().isBefore(now))
                .toList();

        for (Trip trip : activeTrips) {
            try {
                weatherService.getCurrentWeather(trip.getDestination())
                    .subscribe(weather -> checkWeatherConditions(trip, weather));
            } catch (Exception e) {
                log.error("Error updating weather for trip to {}: {}", 
                    trip.getDestination(), e.getMessage());
            }
        }

        // Clean up expired alerts
        weatherAlertRepository.deleteByExpiryTimeBefore(LocalDateTime.now());
    }

    private void checkWeatherConditions(Trip trip, WeatherDTO weather) {
        // Check for extreme temperatures
        if (weather.getTemperature() > 35.0) {
            createWeatherAlert(trip, "High Temperature", 
                "Temperature is very high: " + weather.getFormattedTemperature(), 
                "WARNING");
        } else if (weather.getTemperature() < 0.0) {
            createWeatherAlert(trip, "Low Temperature", 
                "Temperature is below freezing: " + weather.getFormattedTemperature(), 
                "WARNING");
        }

        // Check for strong winds
        if (weather.getWindSpeed() > 15.0) {
            createWeatherAlert(trip, "Strong Winds", 
                "Strong winds detected: " + weather.getFormattedWindSpeed(), 
                "WARNING");
        }

        // Check for extreme humidity
        if (weather.getHumidity() > 85) {
            createWeatherAlert(trip, "High Humidity", 
                "Very humid conditions: " + weather.getFormattedHumidity(), 
                "INFO");
        }

        // Check for severe weather conditions
        if (weather.getDescription().toLowerCase().contains("storm") ||
            weather.getDescription().toLowerCase().contains("snow") ||
            weather.getDescription().toLowerCase().contains("heavy rain")) {
            createWeatherAlert(trip, "Severe Weather", 
                "Severe weather condition: " + weather.getDescription(), 
                "SEVERE");
        }
    }

    private void createWeatherAlert(Trip trip, String alertType, String description, String severity) {
        WeatherAlert alert = weatherService.createWeatherAlert(
            trip, 
            alertType, 
            description, 
            severity,
            LocalDateTime.now().plusDays(1)
        );
        trip.addWeatherAlert(alert);
        weatherAlertRepository.save(alert);
        log.info("Created weather alert for trip to {}: {}", trip.getDestination(), description);
    }
}
