package com.traceflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

public class ActivityTileDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private LocalDate date;
        private Integer count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserActivityResponse {
        private Long userId;
        private String username;
        private List<Response> tiles;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class YearActivityResponse {
        private Integer year;
        private List<MonthActivity> months;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class MonthActivity {
            private Integer month;
            private List<Response> tiles;
        }
    }
}
