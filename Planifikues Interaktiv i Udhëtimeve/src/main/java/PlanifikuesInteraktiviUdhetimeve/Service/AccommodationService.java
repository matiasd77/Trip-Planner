package PlanifikuesInteraktiviUdhetimeve.Service;

import PlanifikuesInteraktiviUdhetimeve.DTO.AccommodationDTO;
import PlanifikuesInteraktiviUdhetimeve.Entity.Accommodation;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;
import PlanifikuesInteraktiviUdhetimeve.Mapper.AccommodationMapper;
import PlanifikuesInteraktiviUdhetimeve.Repository.AccommodationRepository;
import PlanifikuesInteraktiviUdhetimeve.Repository.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class AccommodationService {

    private final AccommodationRepository accommodationRepo;
    private final TripRepository tripRepo;

    public AccommodationService(AccommodationRepository accommodationRepo, TripRepository tripRepo) {
        this.accommodationRepo = accommodationRepo;
        this.tripRepo = tripRepo;
    }

    public AccommodationDTO addAccommodation(AccommodationDTO dto) {
        Trip trip = tripRepo.findById(dto.getTripId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                "Trip with ID " + dto.getTripId() + " not found"));
        Accommodation accommodation = AccommodationMapper.toEntity(dto, trip);
        return AccommodationMapper.toDTO(accommodationRepo.save(accommodation));
    }

    public List<AccommodationDTO> getAccommodationsByTripId(Long tripId) {
        try {
            Trip trip = tripRepo.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "Trip with ID " + tripId + " not found"));
            
            List<Accommodation> accommodations = accommodationRepo.findByTrip(trip);
            if (accommodations == null) {
                return new ArrayList<>();
            }
            
            return accommodations.stream()
                    .map(AccommodationMapper::toDTO)
                    .filter(dto -> dto != null)
                    .collect(Collectors.toList());
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            String errorMessage = String.format("Error fetching accommodations for trip %d: %s", tripId, e.getMessage());
            System.err.println(errorMessage);
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, errorMessage);
        }
    }

    public void deleteAccommodation(Long id) {
        accommodationRepo.deleteById(id);
    }

    public List<AccommodationDTO> getAllAccommodations() {
        return accommodationRepo.findAll().stream()
                .map(AccommodationMapper::toDTO)
                .collect(Collectors.toList());
    }
}
