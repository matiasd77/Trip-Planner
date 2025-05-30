package PlanifikuesInteraktiviUdhetimeve.Service;

import PlanifikuesInteraktiviUdhetimeve.DTO.ActivityDTO;
import PlanifikuesInteraktiviUdhetimeve.Entity.Activity;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;
import PlanifikuesInteraktiviUdhetimeve.Mapper.ActivityMapper;
import PlanifikuesInteraktiviUdhetimeve.Repository.ActivityRepository;
import PlanifikuesInteraktiviUdhetimeve.Repository.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    private final ActivityRepository activityRepo;
    private final TripRepository tripRepo;

    public ActivityService(ActivityRepository activityRepo, TripRepository tripRepo) {
        this.activityRepo = activityRepo;
        this.tripRepo = tripRepo;
    }

    public ActivityDTO addActivity(ActivityDTO dto) {
        Trip trip = tripRepo.findById(dto.getTripId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found with id: " + dto.getTripId()));
        Activity activity = ActivityMapper.toEntity(dto, trip);
        return ActivityMapper.toDTO(activityRepo.save(activity));
    }

    public List<ActivityDTO> getActivitiesByTripId(Long tripId) {
        Trip trip = tripRepo.findById(tripId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found with id: " + tripId));
        return activityRepo.findByTrip(trip).stream()
                .map(ActivityMapper::toDTO)
                .collect(Collectors.toList());
    }

    public void deleteActivity(Long id) {
        activityRepo.deleteById(id);
    }
}

