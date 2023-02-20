package de.neuefische.backend.controller;

import de.neuefische.backend.model.CsvImportResult;
import de.neuefische.backend.service.CsvService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;

@RestController
@RequestMapping("/api/csv")
@RequiredArgsConstructor
public class CsvController {
    private final CsvService csvService;

    @PostMapping
    public CsvImportResult uploadCsv(@RequestParam("file") MultipartFile file) throws IOException {
        return csvService.importCsv(new InputStreamReader(file.getInputStream()));
    }
}
