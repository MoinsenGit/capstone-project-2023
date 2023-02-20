package de.neuefische.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Item {
    private String id;
    @NotBlank(message = "Please provide a Title!")
    private String name;
    @NotNull(message = "Please provide a Price!")
    @Min(value = 0, message = "Price must be greater than 0!")
    private Double price;
    @NotBlank(message = "Please provide a Description!")
    private String description;
    @Valid
    @NotNull(message = "Please provide an Image URL or upload an image!")
    private Image image;
    private String category;
    private String createdBy;
    private Status status;
}
