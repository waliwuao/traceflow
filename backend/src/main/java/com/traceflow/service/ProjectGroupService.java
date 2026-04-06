package com.traceflow.service;

import com.traceflow.dto.ProjectGroupDto;
import com.traceflow.exception.BadRequestException;
import com.traceflow.exception.ResourceNotFoundException;
import com.traceflow.model.ProjectGroup;
import com.traceflow.model.User;
import com.traceflow.repository.ProjectGroupRepository;
import com.traceflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectGroupService {

    private final ProjectGroupRepository projectGroupRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProjectGroupDto.Response create(ProjectGroupDto.CreateRequest request) {
        ProjectGroup parent = null;
        if (request.getParentId() != null) {
            parent = projectGroupRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("ProjectGroup", "id", request.getParentId()));
        }

        ProjectGroup group = ProjectGroup.builder()
                .name(request.getName())
                .description(request.getDescription())
                .parent(parent)
                .build();

        ProjectGroup saved = projectGroupRepository.save(group);
        return toResponse(saved);
    }

    public ProjectGroupDto.Response getById(Long id) {
        ProjectGroup group = projectGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectGroup", "id", id));
        return toResponse(group);
    }

    public List<ProjectGroupDto.Response> getRootGroups() {
        return projectGroupRepository.findByParentIsNull().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectGroupDto.Response> getByParentId(Long parentId) {
        return projectGroupRepository.findByParentId(parentId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectGroupDto.Response update(Long id, ProjectGroupDto.UpdateRequest request) {
        ProjectGroup group = projectGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectGroup", "id", id));

        if (request.getName() != null) group.setName(request.getName());
        if (request.getDescription() != null) group.setDescription(request.getDescription());

        ProjectGroup saved = projectGroupRepository.save(group);
        return toResponse(saved);
    }

    @Transactional
    public ProjectGroupDto.Response addMembers(Long id, ProjectGroupDto.AddMembersRequest request) {
        ProjectGroup group = projectGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectGroup", "id", id));

        Set<User> members = request.getUserIds().stream()
                .map(userId -> userRepository.findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId)))
                .collect(Collectors.toSet());

        group.getMembers().addAll(members);
        ProjectGroup saved = projectGroupRepository.save(group);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        ProjectGroup group = projectGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectGroup", "id", id));
        projectGroupRepository.delete(group);
    }

    private ProjectGroupDto.Response toResponse(ProjectGroup group) {
        List<ProjectGroupDto.Response> children = group.getChildren().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        Set<ProjectGroupDto.MemberInfo> memberInfos = group.getMembers().stream()
                .map(m -> ProjectGroupDto.MemberInfo.builder()
                        .id(m.getId())
                        .username(m.getUsername())
                        .displayName(m.getDisplayName())
                        .build())
                .collect(Collectors.toSet());

        return ProjectGroupDto.Response.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .parentId(group.getParent() != null ? group.getParent().getId() : null)
                .parentName(group.getParent() != null ? group.getParent().getName() : null)
                .children(children)
                .members(memberInfos)
                .createdAt(group.getCreatedAt() != null ? group.getCreatedAt().toString() : null)
                .updatedAt(group.getUpdatedAt() != null ? group.getUpdatedAt().toString() : null)
                .build();
    }
}
