package de.neuefische.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.neuefische.backend.model.Item;
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
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class ItemControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ItemRepository itemRepository;

    @Test
    void createItem_whenNotLoggedIn_shouldReturn401() throws Exception {
        mockMvc.perform(post("/api/items"))
                .andExpect(status().isUnauthorized()
                );
    }

    @Test
    @WithMockUser(username = "testuser")
    void createNewItem_whenLoggedInAsUser_shouldReturnCreatedItem() throws Exception {
        Item testItem = new Item("1", "test", 1.0, "test", null, "test");
        final String json = new ObjectMapper().writerWithDefaultPrettyPrinter()
                .writeValueAsString(testItem);

        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(content().json(json));

        assertThat(itemRepository.findById("1")).isPresent();
        assertThat(itemRepository.findById("1").get()).isEqualTo(testItem);
    }

    @Test
    void getAll_whenNotLoggedIn_Return401() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/items"))
                .andExpect(status().isUnauthorized()
                );
    }

    @Test
    @WithMockUser(username = "testuser")
    void getAll_whenLoggedInAsUser_shouldReturnItems() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/items"))
                .andExpectAll(
                        status().isOk(),
                        content().json(
                                "[]",
                                true
                        )
                );
    }

    @Test
    void getItemById_whenNotLoggedIn_shouldReturn401() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/items/1"))
                .andExpect(status().isUnauthorized()
                );
    }

    @Test
    @WithMockUser(username = "testuser")
    void getItemById_whenLoggedInAsUser_shouldReturnItem() throws Exception {
        String itemAsJson = """
                {"id":"1",
                "name":"test",
                "price":1.0,
                "description":"test",
                "image":null,
                "category":"test"
                }
                """;

        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(itemAsJson))
                .andExpect(status().isOk())
                .andExpect(content().json(itemAsJson));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/items/1"))
                .andExpectAll(
                        status().isOk(),
                        content().json(
                                itemAsJson,
                                true
                        )
                );
    }

    @Test
    void updateItem_whenNotLoggedIn_shouldReturn401() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.put("/api/items/1"))
                .andExpect(status().isUnauthorized()
                );
    }

    @Test
    @WithMockUser(username = "testuser")
    void updateItem_whenLoggedInAsUser_shouldReturnItem() throws Exception {
        String itemAsJson = """
                {"id":"1",
                "name":"test",
                "price":1.0,
                "description":"test",
                "image":null,
                "category":"test"
                }
                """;

        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(itemAsJson))
                .andExpect(status().isOk())
                .andExpect(content().json(itemAsJson));

        String updatedItemAsJson = """
                {"id":"3",
                "name":"test",
                "price":1.0,
                "description":"test",
                "image":null,
                "category":"test"
                }
                """;

        mockMvc.perform(MockMvcRequestBuilders.put("/api/items/3")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedItemAsJson))
                .andExpectAll(
                        status().isOk(),
                        content().json(
                                updatedItemAsJson,
                                true
                        )
                );
        assertTrue(itemRepository.findById("3").isPresent());

    }

    @Test
    void deleteItem_whenNotLoggedIn_shouldReturn401() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/items/1"))
                .andExpect(status().isUnauthorized()
                );
    }

    @Test
    @WithMockUser(username = "testuser")
    void deleteItem_whenLoggedInAsUser_shouldReturnItem() throws Exception {
        String itemAsJson = """
                {
                "id":"7",
                "name":"test",
                "price":1.0,
                "description":"test",
                "image":null,
                "category":"test"
                }
                """;

        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(itemAsJson))
                .andExpect(status().isOk())
                .andExpect(content().json(itemAsJson));

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/items/7"))
                .andExpect(status().isOk());

        assertFalse(itemRepository.findById("7").isPresent());
    }

}
