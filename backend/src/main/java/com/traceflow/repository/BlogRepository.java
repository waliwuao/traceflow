package com.traceflow.repository;

import com.traceflow.model.Blog;
import com.traceflow.model.ProjectGroup;
import com.traceflow.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

    Page<Blog> findByAuthorOrderByPublishDateDesc(User author, Pageable pageable);

    @Query("SELECT b FROM Blog b WHERE :group MEMBER OF b.linkedGroups ORDER BY b.publishDate DESC")
    Page<Blog> findByLinkedGroup(@Param("group") ProjectGroup group, Pageable pageable);

    @Query("SELECT b FROM Blog b JOIN b.linkedGroups pg WHERE pg.id = :groupId ORDER BY b.publishDate DESC")
    Page<Blog> findByGroupId(@Param("groupId") Long groupId, Pageable pageable);

    @Query("SELECT b FROM Blog b JOIN b.linkedGroups pg WHERE pg.id IN :groupIds ORDER BY b.publishDate DESC")
    Page<Blog> findByGroupIds(@Param("groupIds") Set<Long> groupIds, Pageable pageable);

    List<Blog> findByAuthorIdOrderByPublishDateDesc(Long authorId);

    @Query("SELECT COUNT(b) FROM Blog b WHERE b.author.id = :userId AND b.publishDate = :date")
    long countByAuthorIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT b FROM Blog b WHERE b.author.id = :userId AND b.publishDate BETWEEN :startDate AND :endDate ORDER BY b.publishDate")
    List<Blog> findByAuthorIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
