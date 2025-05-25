package PlanifikuesInteraktiviUdhetimeve.Mapper;


import PlanifikuesInteraktiviUdhetimeve.DTO.TransportDTO;
import PlanifikuesInteraktiviUdhetimeve.Entity.Transport;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;

public class TransportMapper {

    public static TransportDTO toDTO(Transport transport) {
        return new TransportDTO(
                transport.getId(),
                transport.getType(),
                transport.getCompany(),
                transport.getDepartureTime(),
                transport.getArrivalTime(),
                transport.getTrip().getId()
        );
    }

    public static Transport toEntity(TransportDTO dto, Trip trip) {
        return new Transport(
                dto.getId(),
                dto.getType(),
                dto.getCompany(),
                dto.getDepartureTime(),
                dto.getArrivalTime(),
                trip
        );
    }
}

