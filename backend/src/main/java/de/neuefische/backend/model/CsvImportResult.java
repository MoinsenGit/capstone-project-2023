package de.neuefische.backend.model;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
@Data
public class CsvImportResult {
    private final List<Item> items;
   private final List<String> errors;
}
