package com.traceflow.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "project_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private ProjectGroup parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    @Builder.Default
    private List<ProjectGroup> children = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "project_group_members",
        joinColumns = @JoinColumn(name = "project_group_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private Set<User> members = new HashSet<>();

    @ManyToMany(mappedBy = "linkedGroups")
    @Builder.Default
    private Set<Blog> blogs = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        validateNestingLevel();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        validateNestingLevel();
    }

    private void validateNestingLevel() {
        int depth = 0;
        ProjectGroup current = parent;
        while (current != null) {
            depth++;
            if (depth > 2) {
                throw new IllegalStateException("Project group nesting exceeds maximum level of 2");
            }
            current = current.getParent();
        }
    }

    public List<ProjectGroup> getAllParentGroups() {
        List<ProjectGroup> parents = new ArrayList<>();
        ProjectGroup current = parent;
        while (current != null) {
            parents.add(0, current);
            current = current.getParent();
        }
        return parents;
    }
}
