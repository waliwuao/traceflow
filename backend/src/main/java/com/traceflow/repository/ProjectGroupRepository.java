package com.traceflow.repository;

import com.traceflow.model.ProjectGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Set;

@Repository
public interface ProjectGroupRepository extends JpaRepository<ProjectGroup, Long> {

    List<ProjectGroup> findByParentIsNull();

    List<ProjectGroup> findByParentId(Long parentId);

    @Query("SELECT pg FROM ProjectGroup pg LEFT JOIN FETCH pg.members WHERE pg.id = :id")
    ProjectGroup findByIdWithMembers(@Param("id") Long id);

    @Query("SELECT pg FROM ProjectGroup pg WHERE :user MEMBER OF pg.members")
    List<ProjectGroup> findByMember(@Param("user") com.traceflow.model.User user);

    @Query("SELECT pg FROM ProjectGroup pg JOIN pg.members m WHERE m.id = :userId")
    Set<ProjectGroup> findByMemberId(@Param("userId") Long userId);
}
