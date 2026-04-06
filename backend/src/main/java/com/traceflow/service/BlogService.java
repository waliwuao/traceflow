package com.traceflow.service;

import com.traceflow.dto.BlogDto;
import com.traceflow.exception.ResourceNotFoundException;
import com.traceflow.model.Blog;
import com.traceflow.model.ProjectGroup;
import com.traceflow.model.User;
import com.traceflow.repository.ActivityTileRepository;
import com.traceflow.repository.BlogRepository;
import com.traceflow.repository.ProjectGroupRepository;
import com.traceflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final ProjectGroupRepository projectGroupRepository;
    private final ActivityTileRepository activityTileRepository;

    @Transactional
    public BlogDto.Response create(BlogDto.CreateRequest request, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));

        Set<ProjectGroup> groups = null;
        if (request.getGroupIds() != null && !request.getGroupIds().isEmpty()) {
            groups = request.getGroupIds().stream()
                    .map(groupId -> projectGroupRepository.findById(groupId)
                            .orElseThrow(() -> new ResourceNotFoundException("ProjectGroup", "id", groupId)))
                    .collect(Collectors.toSet());
        }

        LocalDate publishDate = request.getPublishDate() != null ? request.getPublishDate() : LocalDate.now();

        Blog blog = Blog.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .publishDate(publishDate)
                .author(author)
                .linkedGroups(groups != null ? groups : new HashSet<>())
                .build();

        Blog saved = blogRepository.save(blog);
        activityTileRepository.incrementCount(authorId, publishDate);
        return toResponse(saved);
    }

    public BlogDto.Response getById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));
        return toResponse(blog);
    }

    public Page<BlogDto.ListResponse> getByAuthor(Long authorId, int page, int size) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));
        return blogRepository.findByAuthorOrderByPublishDateDesc(author, PageRequest.of(page, size))
                .map(this::toListResponse);
    }

    public Page<BlogDto.ListResponse> getByGroup(Long groupId, int page, int size) {
        return blogRepository.findByGroupId(groupId, PageRequest.of(page, size))
                .map(this::toListResponse);
    }

    @Transactional
    public BlogDto.Response update(Long id, BlogDto.UpdateRequest request) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));

        if (request.getTitle() != null) blog.setTitle(request.getTitle());
        if (request.getContent() != null) blog.setContent(request.getContent());
        if (request.getPublishDate() != null) blog.setPublishDate(request.getPublishDate());
        if (request.getGroupIds() != null) {
            Set<ProjectGroup> groups = request.getGroupIds().stream()
                    .map(groupId -> projectGroupRepository.findById(groupId)
                            .orElseThrow(() -> new ResourceNotFoundException("ProjectGroup", "id", groupId)))
                    .collect(Collectors.toSet());
            blog.setLinkedGroups(groups);
        }

        Blog saved = blogRepository.save(blog);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        blogRepository.deleteById(id);
    }

    private BlogDto.Response toResponse(Blog blog) {
        Set<BlogDto.GroupInfo> groupInfos = blog.getLinkedGroups().stream()
                .map(g -> BlogDto.GroupInfo.builder().id(g.getId()).name(g.getName()).build())
                .collect(Collectors.toSet());

        BlogDto.AuthorInfo authorInfo = BlogDto.AuthorInfo.builder()
                .id(blog.getAuthor().getId())
                .username(blog.getAuthor().getUsername())
                .displayName(blog.getAuthor().getDisplayName())
                .build();

        return BlogDto.Response.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .content(blog.getContent())
                .publishDate(blog.getPublishDate())
                .author(authorInfo)
                .linkedGroups(groupInfos)
                .commentCount(blog.getComments().size())
                .createdAt(blog.getCreatedAt() != null ? blog.getCreatedAt().toString() : null)
                .updatedAt(blog.getUpdatedAt() != null ? blog.getUpdatedAt().toString() : null)
                .build();
    }

    private BlogDto.ListResponse toListResponse(Blog blog) {
        Set<BlogDto.GroupInfo> groupInfos = blog.getLinkedGroups().stream()
                .map(g -> BlogDto.GroupInfo.builder().id(g.getId()).name(g.getName()).build())
                .collect(Collectors.toSet());

        BlogDto.AuthorInfo authorInfo = BlogDto.AuthorInfo.builder()
                .id(blog.getAuthor().getId())
                .username(blog.getAuthor().getUsername())
                .displayName(blog.getAuthor().getDisplayName())
                .build();

        return BlogDto.ListResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .publishDate(blog.getPublishDate())
                .author(authorInfo)
                .linkedGroups(groupInfos)
                .commentCount(blog.getComments().size())
                .build();
    }
}
