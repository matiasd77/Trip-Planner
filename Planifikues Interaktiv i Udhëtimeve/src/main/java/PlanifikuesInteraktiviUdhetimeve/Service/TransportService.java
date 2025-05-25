package PlanifikuesInteraktiviUdhetimeve.Service;


import PlanifikuesInteraktiviUdhetimeve.DTO.TransportDTO;
import PlanifikuesInteraktiviUdhetimeve.Entity.Transport;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;
import PlanifikuesInteraktiviUdhetimeve.Mapper.TransportMapper;
import PlanifikuesInteraktiviUdhetimeve.Repository.TransportRepository;
import PlanifikuesInteraktiviUdhetimeve.Repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransportService {

    private final TransportRepository transportRepo;
    private final TripRepository tripRepo;

    public TransportService(TransportRepository transportRepo, TripRepository tripRepo) {
        this.transportRepo = transportRepo;
        this.tripRepo = tripRepo;
    }

    public TransportDTO addTransport(TransportDTO dto) {
        Trip trip = tripRepo.findById(dto.getTripId()).orElseThrow();
        Transport transport = TransportMapper.toEntity(dto, trip);
        return TransportMapper.toDTO(transportRepo.save(transport));
    }

    public List<TransportDTO> getTransportsByTripId(Long tripId) {
        Trip trip = tripRepo.findById(tripId).orElseThrow();
        return transportRepo.findByTrip(trip).stream()
                .map(TransportMapper::toDTO)
                .collect(Collectors.toList());
    }

    public void deleteTransport(Long id) {
        transportRepo.deleteById(id);
    }
}
