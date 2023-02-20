package de.neuefische.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.neuefische.backend.model.AppUser;
import de.neuefische.backend.model.Image;
import de.neuefische.backend.model.Item;
import de.neuefische.backend.model.Status;
import de.neuefische.backend.repository.AppUserRepository;
import de.neuefische.backend.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CsvControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private AppUserRepository appUserRepository;

    @BeforeEach
    void setup() {
        itemRepository.deleteAll();
        appUserRepository.deleteAll();
    }

    @Test
    void uploadCsv_whenUserNotLoggedIn_shouldReturn401() throws Exception {
        MockMultipartFile testFile = new MockMultipartFile("file", "import.csv", "multipart/form-data", "c;s;v".getBytes());

        mockMvc.perform(multipart("/api/csv").file(testFile)).andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "testuser")
    void uploadFile_whenUserLoggedIn_shouldImportItemsAndReturnImportResult() throws Exception {
        appUserRepository.save(new AppUser("2", "testuser", "testpassword"));

        MockMultipartFile testFile = new MockMultipartFile("file", "import.csv", "multipart/form-data", """
                name,price,description,imageUrl,category,status
                Test Item 1,12.50,Description 1,https://www.image.de/test.jpg,Category 1,reserved
                Test Item 2,twelve forty,Will fail,image.jpg,Category 2,
                Test Item 3,,Description 3,https://www.image.de/test.jpg,,
                Test Item 4,,Description 4,image.jpg,,WAITING
                ,,,,,
                """.getBytes());

        String response = mockMvc.perform(multipart("/api/csv").file(testFile))
                .andExpect(status().isOk())
                .andReturn().
                getResponse()
                .getContentAsString();

        Map<String, List<Object>> importResult = new ObjectMapper().readValue(response, HashMap.class);

        assertThat(importResult.get("items")).hasSize(2);
        String itemId1 = ((Map<String, String>) importResult.get("items").get(0)).get("id");
        assertThat(itemRepository.findById(itemId1)).contains(Item.builder().id(itemId1).name("Test Item 1")
                .price(12.5).description("Description 1").image(Image.builder().url("https://www.image.de/test.jpg").build())
                .category("Category 1").createdBy("2").status(Status.RESERVED).build());
        String itemId2 = ((Map<String, String>) importResult.get("items").get(1)).get("id");
        assertThat(itemRepository.findById(itemId2)).contains(Item.builder().id(itemId2).name("Test Item 3")
                .description("Description 3").image(Image.builder().url("https://www.image.de/test.jpg").build())
                .createdBy("2").status(Status.AVAILABLE).build());

        assertThat(importResult.get("errors")).containsExactlyInAnyOrder(
                "Error in line 2, can not import item: For input string: \"twelve forty\"",
                "Error in line 4, can not import item: No enum constant de.neuefische.backend.model.Status.WAITING",
                "Error in line 5, can not import item: Name is required"
        );
    }
}