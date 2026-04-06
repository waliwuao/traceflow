package com.traceflow.controller;

import com.traceflow.dto.CommentDto;
import com.traceflow.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDto.Response> create(@Valid @RequestBody CommentDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.create(request, 1L));
    }

    @GetMapping("/blog/{blogId}")
    public ResponseEntity<List<CommentDto.Response>> getByBlogId(@PathVariable Long blogId) {
        return ResponseEntity.ok(commentService.getByBlogId(blogId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        commentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
