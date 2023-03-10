package de.neuefische.backend.controller;

import de.neuefische.backend.model.FileData;
import de.neuefische.backend.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;

    @PostMapping
    public FileData uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        return fileService.saveFile(file);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InputStreamResource> getFile(@PathVariable String id) throws IOException {
        GridFsResource gridFsResource = fileService.getResource(id);

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(gridFsResource.getContentType()))
                .body(new InputStreamResource(gridFsResource.getInputStream()));
    }

    @GetMapping("/{id}/data")
    public FileData getFileData(@PathVariable String id) {
        return fileService.getFileData(id);
    }
}