package com.traceflow.repository;

import com.traceflow.model.ActivityTile;
import com.traceflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityTileRepository extends JpaRepository<ActivityTile, Long> {

    Optional<ActivityTile> findByUserAndActivityDate(User user, LocalDate activityDate);

    List<ActivityTile> findByUserOrderByActivityDateDesc(User user);

    @Query("SELECT at FROM ActivityTile at WHERE at.user.id = :userId AND at.activityDate BETWEEN :startDate AND :endDate ORDER BY at.activityDate")
    List<ActivityTile> findByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Modifying
    @Query(value = "INSERT INTO activity_tiles (user_id, activity_date, count) VALUES (:userId, :date, 1) " +
            "ON CONFLICT (user_id, activity_date) DO UPDATE SET count = activity_tiles.count + 1",
            nativeQuery = true)
    void incrementCount(@Param("userId") Long userId, @Param("date") LocalDate date);
}
