package com.traceflow.controller;

import com.traceflow.dto.ActivityTileDto;
import com.traceflow.service.ActivityTileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/activity")
@RequiredArgsConstructor
public class ActivityTileController {

    private final ActivityTileService activityTileService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ActivityTileDto.UserActivityResponse> getUserActivity(@PathVariable Long userId) {
        return ResponseEntity.ok(activityTileService.getUserActivity(userId));
    }

    @GetMapping("/user/{userId}/year")
    public ResponseEntity<ActivityTileDto.YearActivityResponse> getYearActivity(
            @PathVariable Long userId,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(activityTileService.getYearActivity(userId, year));
    }
}
