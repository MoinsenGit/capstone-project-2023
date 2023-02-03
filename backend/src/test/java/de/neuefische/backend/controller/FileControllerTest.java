package de.neuefische.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class FileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void uploadFile_whenUserNotLoggedIn_shouldReturn401() throws Exception {
        MockMultipartFile testFile = new MockMultipartFile("file", "test.img", "multipart/form-data", "test data".getBytes());

        mockMvc.perform(multipart("/api/files")
                        .file(testFile)
                )
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "testuser")
    void uploadFile_whenUserLoggedIn_shouldReturnFileData() throws Exception {
        MockMultipartFile testFile = new MockMultipartFile("file", "test.img", "multipart/form-data", "test data".getBytes());

        final String response = mockMvc.perform(multipart("/api/files")
                        .file(testFile)
                )
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        final String fileId = new ObjectMapper().readValue(response, HashMap.class).get("id").toString();

        mockMvc.perform(get("/api/files/" + fileId))
                .andExpect(status().isOk())
                .andExpect(content().string("test data"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void uploadFile_whenUserLoggedInAndEmptyFile_shouldReturnBadRequest() throws Exception {
        MockMultipartFile testFile = new MockMultipartFile("file", "empty.img", "multipart/form-data", "".getBytes());

        mockMvc.perform(multipart("/api/files")
                        .file(testFile)
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    void getFile_whenUserIsNotLoggedIn_shouldReturn401() throws Exception {
        mockMvc.perform(get("/api/files/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "testuser")
    void getFile_whenUserIsLoggedInAndFileDoesNotExist_shouldReturn404() throws Exception {
        mockMvc.perform(get("/api/files/1"))
                .andExpect(status().isNotFound());
    }
}