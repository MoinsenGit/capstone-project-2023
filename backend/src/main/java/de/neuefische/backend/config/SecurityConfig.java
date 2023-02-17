package de.neuefische.backend.config;


import de.neuefische.backend.model.AppUser;
import de.neuefische.backend.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final AppUserService appUserService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf().disable()
                .httpBasic().authenticationEntryPoint(new PreventBasicAuthPopupEntryPoint()).and()
                .authorizeHttpRequests()
                .antMatchers(
                        HttpMethod.POST,
                        "/api/users"
                ).permitAll()
                .antMatchers(
                        HttpMethod.POST,
                        "/api/users/login"
                )
                .permitAll()
                .antMatchers(
                        "/api/**"
                )
                .authenticated()
                .anyRequest()
                .permitAll()
                .and()
                .build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            Optional<AppUser> user = appUserService.findByUsername(username);

            if (user.isEmpty()) {
                throw new UsernameNotFoundException(username);
            }

            AppUser appUser = user.get();

            return User.builder()
                    .username(appUser.getUsername())
                    .password(appUser.getPassword())
                    .roles("BASIC")
                    .build();
        };
    }

    // Prevents the basic auth popup in browser, but still allows logins via the login page.
    // See: https://stackoverflow.com/questions/31424196#answer-50023070
    private static class PreventBasicAuthPopupEntryPoint implements AuthenticationEntryPoint {
        @Override
        public void commence(HttpServletRequest request, HttpServletResponse response,
                             AuthenticationException authException) throws IOException {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage());
        }
    }
}
