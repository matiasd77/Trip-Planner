package PlanifikuesInteraktiviUdhetimeve.Service;

import PlanifikuesInteraktiviUdhetimeve.DTO.AccommodationDTO;
import PlanifikuesInteraktiviUdhetimeve.Entity.Accommodation;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;
import PlanifikuesInteraktiviUdhetimeve.Mapper.AccommodationMapper;
import PlanifikuesInteraktiviUdhetimeve.Repository.AccommodationRepository;
import PlanifikuesInteraktiviUdhetimeve.Repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccommodationService {

    private final AccommodationRepository accommodationRepo;
    private final TripRepository tripRepo;

    public AccommodationService(AccommodationRepository accommodationRepo, TripRepository tripRepo) {
        this.accommodationRepo = accommodationRepo;
        this.tripRepo = tripRepo;
    }

    public AccommodationDTO addAccommodation(AccommodationDTO dto) {
        Trip trip = tripRepo.findById(dto.getTripId()).orElseThrow();
        Accommodation accommodation = AccommodationMapper.toEntity(dto, trip);
        return AccommodationMapper.toDTO(accommodationRepo.save(accommodation));
    }

    public List<AccommodationDTO> getAccommodationsByTripId(Long tripId) {
        Trip trip = tripRepo.findById(tripId).orElseThrow();
        return accommodationRepo.findByTrip(trip).stream()
                .map(AccommodationMapper::toDTO)
                .collect(Collectors.toList());
    }

    public void deleteAccommodation(Long id) {
        accommodationRepo.deleteById(id);
    }
}

