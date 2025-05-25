package PlanifikuesInteraktiviUdhetimeve.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PlanifikuesInteraktiviUdhetimeve.Entity.WeatherAlert;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WeatherAlertRepository extends JpaRepository<WeatherAlert, Long> {
    
    List<WeatherAlert> findByTrip(Trip trip);
    
    List<WeatherAlert> findByTripAndAcknowledgedFalseAndExpiryTimeAfter(Trip trip, LocalDateTime now);
    
    List<WeatherAlert> findByAcknowledgedFalseAndExpiryTimeAfter(LocalDateTime now);
    
    List<WeatherAlert> findByCityNameAndAcknowledgedFalseAndExpiryTimeAfter(String cityName, LocalDateTime now);
    
    void deleteByExpiryTimeBefore(LocalDateTime dateTime);
}
