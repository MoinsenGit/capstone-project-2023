package de.neuefische.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Item {
    private String id;
    private String name;
    private Double price;
    private String description;
    private Image image;
    private String category;
    private String createdBy;
}
