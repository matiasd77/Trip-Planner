package PlanifikuesInteraktiviUdhetimeve.Mapper;


import PlanifikuesInteraktiviUdhetimeve.DTO.AccommodationDTO;
import PlanifikuesInteraktiviUdhetimeve.Entity.Accommodation;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;

public class AccommodationMapper {

    public static AccommodationDTO toDTO(Accommodation accommodation) {
        return new AccommodationDTO(
                accommodation.getId(),
                accommodation.getName(),
                accommodation.getAddress(),
                accommodation.getCheckIn(),
                accommodation.getCheckOut(),
                accommodation.getTrip().getId()
        );
    }

    public static Accommodation toEntity(AccommodationDTO dto, Trip trip) {
        return new Accommodation(
                dto.getId(),
                dto.getName(),
                dto.getAddress(),
                dto.getCheckIn(),
                dto.getCheckOut(),
                trip
        );
    }
}

