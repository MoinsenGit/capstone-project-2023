package de.neuefische.backend.service;

import de.neuefische.backend.model.AppUser;
import de.neuefische.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppUserService {
    private final AppUserRepository appUserRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AppUser create (AppUser appUser) {
        Optional<AppUser> existingAppUser = findByUsername(
                appUser.getUsername()
        );

        if (existingAppUser.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }

        appUser.setPassword(passwordEncoder.encode(appUser.getPassword()));

        appUserRepository.save(appUser);

        appUser.setPassword("");

        return appUser;
    }

    public Optional<AppUser> findByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }

    public Optional<AppUser> findByUsernameWithoutPassword(String username) {
        Optional<AppUser> appUser = appUserRepository.findByUsername(username);
        appUser.ifPresent(user -> user.setPassword(""));
        return appUser;
    }

    public AppUser getAuthenticatedUser () {
        return findByUsernameWithoutPassword(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName()
        ).orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));
    }

    public String getAuthenticatedUserId() {
        return getAuthenticatedUser()
                .getId();
    }
}