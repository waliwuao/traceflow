package com.traceflow.service;

import com.traceflow.dto.CommentDto;
import com.traceflow.exception.ResourceNotFoundException;
import com.traceflow.model.Blog;
import com.traceflow.model.Comment;
import com.traceflow.model.User;
import com.traceflow.repository.BlogRepository;
import com.traceflow.repository.CommentRepository;
import com.traceflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentDto.Response create(CommentDto.CreateRequest request, Long authorId) {
        Blog blog = blogRepository.findById(request.getBlogId())
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", request.getBlogId()));

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));

        Comment parentComment = null;
        if (request.getParentCommentId() != null) {
            parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", request.getParentCommentId()));
        }

        Comment comment = Comment.builder()
                .content(request.getContent())
                .blog(blog)
                .author(author)
                .parentComment(parentComment)
                .build();

        Comment saved = commentRepository.save(comment);
        return toResponse(saved);
    }

    public List<CommentDto.Response> getByBlogId(Long blogId) {
        return commentRepository.findByBlogIdOrderByCreatedAtAsc(blogId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        commentRepository.deleteById(id);
    }

    private CommentDto.Response toResponse(Comment comment) {
        List<CommentDto.Response> replies = commentRepository.findByParentCommentIdOrderByCreatedAtAsc(comment.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        CommentDto.AuthorInfo authorInfo = CommentDto.AuthorInfo.builder()
                .id(comment.getAuthor().getId())
                .username(comment.getAuthor().getUsername())
                .displayName(comment.getAuthor().getDisplayName())
                .build();

        return CommentDto.Response.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(authorInfo)
                .blogId(comment.getBlog().getId())
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .replies(replies)
                .createdAt(comment.getCreatedAt() != null ? comment.getCreatedAt().toString() : null)
                .build();
    }
}
