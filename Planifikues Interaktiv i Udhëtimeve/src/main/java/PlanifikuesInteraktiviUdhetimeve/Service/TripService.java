package PlanifikuesInteraktiviUdhetimeve.Service;


import PlanifikuesInteraktiviUdhetimeve.DTO.TripDTO;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;
import PlanifikuesInteraktiviUdhetimeve.Entity.User;
import PlanifikuesInteraktiviUdhetimeve.Mapper.TripMapper;
import PlanifikuesInteraktiviUdhetimeve.Repository.TripRepository;
import PlanifikuesInteraktiviUdhetimeve.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {

    private final TripRepository tripRepo;
    private final UserRepository userRepo;

    public TripService(TripRepository tripRepo, UserRepository userRepo) {
        this.tripRepo = tripRepo;
        this.userRepo = userRepo;
    }

    public TripDTO createTrip(TripDTO dto) {
        User user = userRepo.findById(dto.getUserId()).orElseThrow();
        Trip trip = TripMapper.toEntity(dto, user);
        return TripMapper.toDTO(tripRepo.save(trip));
    }

    public List<TripDTO> getTripsByUserId(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return tripRepo.findByUser(user).stream()
                .map(TripMapper::toDTO)
                .collect(Collectors.toList());
    }

    public TripDTO getTripById(Long id) {
        return tripRepo.findById(id).map(TripMapper::toDTO).orElseThrow();
    }

    public void deleteTrip(Long id) {
        tripRepo.deleteById(id);
    }
}
