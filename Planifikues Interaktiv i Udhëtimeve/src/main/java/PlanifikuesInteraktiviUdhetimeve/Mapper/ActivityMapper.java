package PlanifikuesInteraktiviUdhetimeve.Mapper;


import PlanifikuesInteraktiviUdhetimeve.DTO.ActivityDTO;
import PlanifikuesInteraktiviUdhetimeve.Entity.Activity;
import PlanifikuesInteraktiviUdhetimeve.Entity.Trip;

public class ActivityMapper {

    public static ActivityDTO toDTO(Activity activity) {
        return new ActivityDTO(
                activity.getId(),
                activity.getName(),
                activity.getLocation(),
                activity.getDate(),
                activity.getTrip().getId()
        );
    }

    public static Activity toEntity(ActivityDTO dto, Trip trip) {
        return new Activity(
                dto.getId(),
                dto.getName(),
                dto.getLocation(),
                dto.getDate(),
                trip
        );
    }
}

