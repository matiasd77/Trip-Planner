package PlanifikuesInteraktiviUdhetimeve.Controller;

import PlanifikuesInteraktiviUdhetimeve.DTO.AccommodationDTO;
import PlanifikuesInteraktiviUdhetimeve.Service.AccommodationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/accommodations")
public class AccommodationController {

    private final AccommodationService accommodationService;
    public AccommodationController(AccommodationService accommodationService) {
        this.accommodationService = accommodationService;
    }

    @GetMapping
    public List<AccommodationDTO> getAllAccommodations() {
        return accommodationService.getAllAccommodations();
    }

    @PostMapping
    public AccommodationDTO createAccommodation(@RequestBody AccommodationDTO dto) {
        return accommodationService.addAccommodation(dto);
    }

    @GetMapping("/trip/{tripId}")
    public List<AccommodationDTO> getAccommodationsByTrip(@PathVariable Long tripId) {
        return accommodationService.getAccommodationsByTripId(tripId);
    }

    @DeleteMapping("/{id}")
    public void deleteAccommodation(@PathVariable Long id) {
        accommodationService.deleteAccommodation(id);
    }
}
