package de.neuefische.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppUser {
    private String id;
    private String username;
    private String password;

    // ToDo: add shopId? (if user is a shop owner)
}
