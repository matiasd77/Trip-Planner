package PlanifikuesInteraktiviUdhetimeve.Mapper;


import PlanifikuesInteraktiviUdhetimeve.DTO.TripDTO;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;
import PlanifikuesInteraktiviUdhetimeve.Entity.User;


public class TripMapper {

    public static TripDTO toDTO(Trip trip) {
        return new TripDTO(
                trip.getId(),
                trip.getDestination(),
                trip.getStartDate(),
                trip.getEndDate(),
                trip.getUser().getId()
        );
    }

    public static Trip toEntity(TripDTO dto, User user) {
        return new Trip(
                dto.getId(),
                dto.getDestination(),
                dto.getStartDate(),
                dto.getEndDate(),
                user
        );
    }
}

