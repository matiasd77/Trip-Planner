package PlanifikuesInteraktiviUdhetimeve.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import PlanifikuesInteraktiviUdhetimeve.DTO.WeatherDTO;
import PlanifikuesInteraktiviUdhetimeve.DTO.ForecastDTO;
import PlanifikuesInteraktiviUdhetimeve.DTO.TripDTO;
import PlanifikuesInteraktiviUdhetimeve.Service.WeatherService;
import PlanifikuesInteraktiviUdhetimeve.Service.TripService;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;
import PlanifikuesInteraktiviUdhetimeve.Mapper.TripMapper;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {
    
    private final WeatherService weatherService;
    private final TripService tripService;

    @Autowired
    public WeatherController(WeatherService weatherService, TripService tripService) {
        this.weatherService = weatherService;
        this.tripService = tripService;
    }

    @GetMapping("/current/{city}")
    public Mono<ResponseEntity<WeatherDTO>> getCurrentWeather(@PathVariable String city) {
        return weatherService.getCurrentWeather(city)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/forecast/{city}")
    public Mono<ResponseEntity<ForecastDTO>> getForecast(
            @PathVariable String city,
            @RequestParam(defaultValue = "5") int days) {
        if (days < 1 || days > 5) {
            return Mono.just(ResponseEntity.badRequest().build());
        }
        return weatherService.getForecast(city, days)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/trip/{tripId}/current")
    public Mono<ResponseEntity<WeatherDTO>> getTripWeather(@PathVariable Long tripId) {
        try {
            TripDTO tripDTO = tripService.getTripById(tripId);
            return weatherService.getCurrentWeather(tripDTO.getDestination())
                    .map(ResponseEntity::ok)
                    .defaultIfEmpty(ResponseEntity.notFound().build());
        } catch (NoSuchElementException e) {
            return Mono.just(ResponseEntity.notFound().build());
        }
    }

    @GetMapping("/trip/{tripId}/forecast")
    public Mono<ResponseEntity<ForecastDTO>> getTripForecast(
            @PathVariable Long tripId,
            @RequestParam(defaultValue = "5") int days) {
        if (days < 1 || days > 5) {
            return Mono.just(ResponseEntity.badRequest().build());
        }
        
        try {
            TripDTO tripDTO = tripService.getTripById(tripId);
            return weatherService.getForecast(tripDTO.getDestination(), days)
                    .map(ResponseEntity::ok)
                    .defaultIfEmpty(ResponseEntity.notFound().build());
        } catch (NoSuchElementException e) {
            return Mono.just(ResponseEntity.notFound().build());
        }
    }
}
