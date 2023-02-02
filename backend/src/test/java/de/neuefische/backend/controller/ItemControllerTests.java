package de.neuefische.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.neuefische.backend.model.AppUser;
import de.neuefische.backend.model.Item;
import de.neuefische.backend.repository.AppUserRepository;
import de.neuefische.backend.repository.ItemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext
class ItemControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private AppUserRepository appUserRepository;


    @Test
    void createItem_whenNotLoggedIn_shouldReturn401() throws Exception {
        mockMvc.perform(post("/api/items"))
                .andExpect(status().isUnauthorized()
                );
    }

    @Test
    @WithMockUser(username = "testuser")
    void createNewItem_whenLoggedInAsUser_shouldReturnCreatedItem() throws Exception {
        appUserRepository.save(new AppUser("2", "testuser", "testpassword"));

        Item testItem = new Item("1", "test", 1.0, "test", null, "test", "2");
        final String json = new ObjectMapper()
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(testItem);

        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpectAll(
                        status().isOk(),
                        content().json(json)
                );

        assertThat(itemRepository.findById("1"))
                .isPresent()
                .get()
                .isEqualTo(testItem);
    }

    @Test
    void getAll_whenNotLoggedIn_Return401() throws Exception {
        mockMvc.perform(get("/api/items"))
                .andExpect(
                        status().isUnauthorized()
                );
    }

    @Test
    @WithMockUser(username = "testuser")
    @DirtiesContext
    void getAll_whenLoggedInAsUser_shouldReturnItems() throws Exception {
        appUserRepository.save(new AppUser("2", "testuser", "testpassword"));
        mockMvc.perform(get("/api/items"))
                .andExpectAll(
                        status().isOk(),
                        content().json("[]", true)
                );
    }

    @Test
    void getItemById_whenNotLoggedIn_shouldReturn401() throws Exception {
        mockMvc.perform(get("/api/items/1"))
                .andExpect(
                        status().isUnauthorized()
                );
    }

    @Test
    @WithMockUser(username = "testuser")
    void getItemById_whenLoggedInAsUser_shouldReturnItem() throws Exception {
        appUserRepository.save(new AppUser("2", "testuser", "testpassword"));
        String itemAsJson = """
                {"id":"1",
                "name":"test",
                "price":1.0,
                "description":"test",
                "image":null,
                "category":"test",
                "createdBy":"2"
                }
                """;

        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(itemAsJson))
                .andExpectAll(
                        status().isOk(),
                        content().json(itemAsJson, true)
                );

        mockMvc.perform(MockMvcRequestBuilders.get("/api/items/1"))
                .andExpectAll(
                        status().isOk(),
                        content().json(itemAsJson, true)
                );
    }

    @Test
    void updateItem_whenNotLoggedIn_shouldReturn401() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.put("/api/items/1"))
                .andExpect(
                        status().isUnauthorized()
                );
    }

    @Test
    @WithMockUser(username = "testuser")
    void updateItem_whenLoggedInAsUser_shouldReturnItem() throws Exception {
        appUserRepository.save(new AppUser("2", "testuser", "testpassword"));
        String itemAsJson = """
                {"id":"1",
                "name":"test",
                "price":1.0,
                "description":"test",
                "image":null,
                "category":"test",
                "createdBy":"2"
                }
                """;

        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(itemAsJson))
                .andExpectAll(
                        status().isOk(),
                        content().json(itemAsJson));

        String updatedItemAsJson = """
                {"id":"3",
                "name":"test",
                "price":1.0,
                "description":"test",
                "image":null,
                "category":"test",
                "createdBy":"2"
                }
                """;

        mockMvc.perform(MockMvcRequestBuilders.put("/api/items/3")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedItemAsJson))
                .andExpectAll(
                        status().isOk(),
                        content().json(updatedItemAsJson, true)
                );
        assertTrue(itemRepository.findById("3").isPresent());

    }

    @Test
    void deleteItem_whenNotLoggedIn_shouldReturn401() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/items/1"))
                .andExpect(
                        status().isUnauthorized()
                );
    }

    @Test
    @WithMockUser(username = "testuser")
    @DirtiesContext
    void deleteItem_whenLoggedInAsUser_shouldReturnItem() throws Exception {
        appUserRepository.save(new AppUser("2", "testuser", "testpassword"));
        String itemAsJson = """
                {
                "id":"7",
                "name":"test",
                "price":1.0,
                "description":"test",
                "image":null,
                "category":"test",
                "createdBy":"2"
                }
                """;

        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(itemAsJson))
                .andExpectAll(
                        status().isOk(),
                        content().json(itemAsJson)
                );

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/items/7"))
                .andExpect(
                        status().isOk()
                );

        assertFalse(itemRepository.findById("7").isPresent());
    }

}
