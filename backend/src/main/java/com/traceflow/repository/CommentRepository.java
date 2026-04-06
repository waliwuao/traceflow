package com.traceflow.repository;

import com.traceflow.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByBlogIdOrderByCreatedAtAsc(Long blogId);

    List<Comment> findByParentCommentIdOrderByCreatedAtAsc(Long parentCommentId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.author.id = :userId")
    long countByAuthorId(@Param("userId") Long userId);

    void deleteByBlogId(Long blogId);
}
