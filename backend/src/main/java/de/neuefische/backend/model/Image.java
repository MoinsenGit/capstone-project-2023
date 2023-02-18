package de.neuefische.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Image {
    private String id;
    private String name;
    @NotBlank(message = "Please provide an Image URL or upload an image!")
    private String url;
    private String type;
}
