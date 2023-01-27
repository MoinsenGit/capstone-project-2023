package de.neuefische.backend.controller;

import de.neuefische.backend.model.AppUser;
import de.neuefische.backend.repository.AppUserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;


import javax.servlet.http.HttpSession;

import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@ExtendWith(MockitoExtension.class)
class AppUserControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AppUserRepository appUserRepository;

    @Test
    void getMe_whenUserIsNotLoggedIn_return401() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "testuser")
    void me_whenUserIsLoggedIn_returnUserData() throws Exception {
        appUserRepository.save(new AppUser("2", "testuser", "testpassword"));

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"username\" : \"testuser\",\"password\" : \"\"}"));
    }

    @Test
    void create_whenNewUserIsCreatedSuccessfully_returnCorrectUserData() throws Exception {
        String userAsJson = """
                {"username" : "testuser","password" : "testpassword"}""";
        String response ="""
                {"username" : "testuser","password" : ""}""";

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userAsJson))
                .andExpect(status().isOk())
                .andExpect(content().json(response));
    }

    @Test
    void create_whenNewUserIsCreated_butUsernameExistent_return409Conflict() throws Exception {
        String userAsJson = """
                {"username" : "testuser","password" : "testpassword"}""";
        String response ="""
                {"username" : "testuser","password" : ""}""";

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userAsJson))
                .andExpectAll(status().isOk(), content().json(response));

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON).content(userAsJson))
                .andExpectAll(status().isConflict());
    }

    @Test
    @WithMockUser(username = "testuser")
    void post_LoginWithRegisteredUser() throws Exception {
        appUserRepository.save(new AppUser("2", "testuser", "testpassword"));
        String userAsJson = """
                {"username" : "testuser","password" : "testpassword"}""";
        String response ="""
                {"username" : "testuser","password" : ""}""";

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userAsJson))
                .andExpect(status().isOk())
                .andExpect(content().json(response));
    }

    @Test
   @WithMockUser(username = "testuser")
    void logout_withRegisteredUser() throws Exception {
        mockMvc.perform(get("/api/users/logout"))
                .andExpect(status().isOk());
    }

    @Test // Unit Test with mocked HttpSession
    void logout_invalidatesSession(@Mock HttpSession httpSession) {
        // given:
        var controller = new AppUserController(null);

        // when:
        controller.logout(httpSession);

        // then:
        Mockito.verify(httpSession, times(1)).invalidate();
    }
}