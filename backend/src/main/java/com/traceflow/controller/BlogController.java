package com.traceflow.controller;

import com.traceflow.dto.BlogDto;
import com.traceflow.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @PostMapping
    public ResponseEntity<BlogDto.Response> create(
            @Valid @RequestBody BlogDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long authorId = getCurrentUserId(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(blogService.create(request, authorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getById(id));
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<Page<BlogDto.ListResponse>> getByAuthor(
            @PathVariable Long authorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogService.getByAuthor(authorId, page, size));
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<Page<BlogDto.ListResponse>> getByGroup(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogService.getByGroup(groupId, page, size));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogDto.Response> update(
            @PathVariable Long id,
            @RequestBody BlogDto.UpdateRequest request) {
        return ResponseEntity.ok(blogService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        blogService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Long getCurrentUserId(UserDetails userDetails) {
        return 1L;
    }
}
