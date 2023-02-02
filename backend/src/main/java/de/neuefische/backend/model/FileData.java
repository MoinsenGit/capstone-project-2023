package de.neuefische.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileData {
    private String id;
    private String imageUrl;
    private String name;
    private String contentType;
    private long size;
    private String createdBy;
}
