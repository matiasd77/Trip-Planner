package PlanifikuesInteraktiviUdhetimeve.Repository;


import PlanifikuesInteraktiviUdhetimeve.Entity.Accommodation;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
    List<Accommodation> findByTrip(Trip trip);
}
