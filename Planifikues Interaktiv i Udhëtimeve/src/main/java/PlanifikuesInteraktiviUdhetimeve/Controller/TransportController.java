package PlanifikuesInteraktiviUdhetimeve.Controller;

import PlanifikuesInteraktiviUdhetimeve.DTO.TransportDTO;
import PlanifikuesInteraktiviUdhetimeve.Service.TransportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/transports")
public class TransportController {

    private final TransportService transportService;
    public TransportController(TransportService transportService) {
        this.transportService = transportService;
    }

    @PostMapping("/addTransport")
    public TransportDTO addTransport(@RequestBody TransportDTO dto) {
        return transportService.addTransport(dto);
    }

    @GetMapping("/trip/{tripId}")
    public List<TransportDTO> getTransportsByTrip(@PathVariable Long tripId) {
        return transportService.getTransportsByTripId(tripId);
    }

    @DeleteMapping("/{id}")
    public void deleteTransport(@PathVariable Long id) {
        transportService.deleteTransport(id);
    }
}

