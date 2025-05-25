package PlanifikuesInteraktiviUdhetimeve.Controller;

import PlanifikuesInteraktiviUdhetimeve.DTO.TripDTO;
import PlanifikuesInteraktiviUdhetimeve.Service.TripService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;
    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping("/createTrip")
    public TripDTO createTrip(@RequestBody TripDTO dto) {
        return tripService.createTrip(dto);
    }

    @GetMapping("/user/{userId}")
    public List<TripDTO> getTripsByUserId(@PathVariable Long userId) {
        return tripService.getTripsByUserId(userId);
    }

    @GetMapping("/{id}")
    public TripDTO getTripById(@PathVariable Long id) {
        return tripService.getTripById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
    }
}
