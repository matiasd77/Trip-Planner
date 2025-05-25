package PlanifikuesInteraktiviUdhetimeve.Controller;


import PlanifikuesInteraktiviUdhetimeve.DTO.ActivityDTO;
import PlanifikuesInteraktiviUdhetimeve.Service.ActivityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;
    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping("/addActivity")
    public ActivityDTO addActivity(@RequestBody ActivityDTO dto) {
        return activityService.addActivity(dto);
    }

    @GetMapping("/trip/{tripId}")
    public List<ActivityDTO> getActivitiesByTrip(@PathVariable Long tripId) {
        return activityService.getActivitiesByTripId(tripId);
    }

    @DeleteMapping("/{id}")
    public void deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
    }
}

