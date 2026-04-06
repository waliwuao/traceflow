package com.traceflow.controller;

import com.traceflow.dto.ProjectGroupDto;
import com.traceflow.service.ProjectGroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/project-groups")
@RequiredArgsConstructor
public class ProjectGroupController {

    private final ProjectGroupService projectGroupService;

    @PostMapping
    public ResponseEntity<ProjectGroupDto.Response> create(@Valid @RequestBody ProjectGroupDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectGroupService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectGroupDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectGroupService.getById(id));
    }

    @GetMapping("/roots")
    public ResponseEntity<List<ProjectGroupDto.Response>> getRootGroups() {
        return ResponseEntity.ok(projectGroupService.getRootGroups());
    }

    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<ProjectGroupDto.Response>> getByParentId(@PathVariable Long parentId) {
        return ResponseEntity.ok(projectGroupService.getByParentId(parentId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectGroupDto.Response> update(
            @PathVariable Long id,
            @RequestBody ProjectGroupDto.UpdateRequest request) {
        return ResponseEntity.ok(projectGroupService.update(id, request));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<ProjectGroupDto.Response> addMembers(
            @PathVariable Long id,
            @RequestBody ProjectGroupDto.AddMembersRequest request) {
        return ResponseEntity.ok(projectGroupService.addMembers(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectGroupService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
