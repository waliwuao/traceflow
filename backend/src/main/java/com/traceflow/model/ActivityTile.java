package com.traceflow.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "activity_tiles", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "activity_date"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityTile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(nullable = false)
    @Builder.Default
    private Integer count = 0;

    public void incrementCount() {
        this.count++;
    }

    public void incrementCount(int amount) {
        this.count += amount;
    }
}
