package PlanifikuesInteraktiviUdhetimeve.Repository;


import PlanifikuesInteraktiviUdhetimeve.Entity.Transport;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransportRepository extends JpaRepository<Transport, Long> {
    List<Transport> findByTrip(Trip trip);
}
