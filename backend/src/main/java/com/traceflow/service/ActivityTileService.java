package com.traceflow.service;

import com.traceflow.dto.ActivityTileDto;
import com.traceflow.exception.ResourceNotFoundException;
import com.traceflow.model.ActivityTile;
import com.traceflow.model.User;
import com.traceflow.repository.ActivityTileRepository;
import com.traceflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityTileService {

    private final ActivityTileRepository activityTileRepository;
    private final UserRepository userRepository;

    public ActivityTileDto.UserActivityResponse getUserActivity(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusYears(1);

        List<ActivityTile> tiles = activityTileRepository.findByUserIdAndDateRange(userId, startDate, endDate);
        List<ActivityTileDto.Response> tileResponses = tiles.stream()
                .map(t -> ActivityTileDto.Response.builder()
                        .date(t.getActivityDate())
                        .count(t.getCount())
                        .build())
                .collect(Collectors.toList());

        return ActivityTileDto.UserActivityResponse.builder()
                .userId(userId)
                .username(user.getUsername())
                .tiles(tileResponses)
                .build();
    }

    public ActivityTileDto.YearActivityResponse getYearActivity(Long userId, Integer year) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (year == null) year = LocalDate.now().getYear();

        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);

        List<ActivityTile> tiles = activityTileRepository.findByUserIdAndDateRange(userId, startDate, endDate);

        Map<Integer, List<ActivityTileDto.Response>> byMonth = tiles.stream()
                .map(t -> ActivityTileDto.Response.builder()
                        .date(t.getActivityDate())
                        .count(t.getCount())
                        .build())
                .collect(Collectors.groupingBy(t -> t.getDate().getMonthValue()));

        List<ActivityTileDto.YearActivityResponse.MonthActivity> months = byMonth.entrySet().stream()
                .map(e -> ActivityTileDto.YearActivityResponse.MonthActivity.builder()
                        .month(e.getKey())
                        .tiles(e.getValue())
                        .build())
                .collect(Collectors.toList());

        return ActivityTileDto.YearActivityResponse.builder()
                .year(year)
                .months(months)
                .build();
    }
}
