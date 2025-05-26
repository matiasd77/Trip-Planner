package PlanifikuesInteraktiviUdhetimeve.Mapper;

import PlanifikuesInteraktiviUdhetimeve.DTO.AccommodationDTO;
import PlanifikuesInteraktiviUdhetimeve.Entity.Accommodation;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;

public class AccommodationMapper {

    public static AccommodationDTO toDTO(Accommodation accommodation) {
        if (accommodation == null) {
            return null;
        }
        
        Long tripId = accommodation.getTrip() != null ? accommodation.getTrip().getId() : null;
        
        AccommodationDTO dto = new AccommodationDTO();
        dto.setId(accommodation.getId());
        dto.setName(accommodation.getName());
        dto.setDescription(accommodation.getDescription());
        dto.setLocation(accommodation.getLocation());
        dto.setPrice(accommodation.getPrice());
        dto.setRating(accommodation.getRating());
        dto.setType(accommodation.getType());
        dto.setAmenities(accommodation.getAmenities());
        dto.setCheckIn(accommodation.getCheckIn());
        dto.setCheckOut(accommodation.getCheckOut());
        dto.setTripId(tripId);
        
        return dto;
    }

    public static Accommodation toEntity(AccommodationDTO dto, Trip trip) {
        if (dto == null) {
            return null;
        }
        
        Accommodation accommodation = new Accommodation();
        accommodation.setId(dto.getId());
        accommodation.setName(dto.getName());
        accommodation.setDescription(dto.getDescription());
        accommodation.setLocation(dto.getLocation());
        accommodation.setPrice(dto.getPrice());
        accommodation.setRating(dto.getRating());
        accommodation.setType(dto.getType());
        accommodation.setAmenities(dto.getAmenities());
        accommodation.setCheckIn(dto.getCheckIn());
        accommodation.setCheckOut(dto.getCheckOut());
        accommodation.setTrip(trip);
        
        return accommodation;
    }
}
