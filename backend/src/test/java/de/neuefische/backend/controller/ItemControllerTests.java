package de.neuefische.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.neuefische.backend.model.AppUser;
import de.neuefische.backend.model.Item;
import de.neuefische.backend.model.Status;
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

import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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

        Item testItem = new Item("1", "test", 1.0, "test", null, "test", "2", Status.RESERVED);
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
        String expectedItemAsJson = """
                {"id":"1",
                "name":"test",
                "price":1.0,
                "description":"test",
                "image":null,
                "category":"test",
                "createdBy":"2",
                "status":"AVAILABLE"
                }
                """; // the status has been set to the default value

        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(itemAsJson))
                .andExpectAll(
                        status().isOk(),
                        content().json(expectedItemAsJson, true)
                );

        mockMvc.perform(MockMvcRequestBuilders.get("/api/items/1"))
                .andExpectAll(
                        status().isOk(),
                        content().json(expectedItemAsJson, true)
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
                "createdBy":"2",
                "status":"RESERVED"
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

    @Test
    void filterItem_whenNotLoggedIn_shouldReturn401() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/items/filter")
                        .content("{}"))
                .andExpect(
                        status().isUnauthorized()
                );
    }

    @Test
    @WithMockUser(username = "testuser")
    void filterItem_whenLoggedIn_shouldReturnNothingIfNoItemsAvailable() throws Exception {
        appUserRepository.save(new AppUser("2", "testuser", "testpassword"));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/items/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpectAll(
                        status().isOk(),
                        content().json("[]", true)
                );
    }

    private List<String> extractItemIds(final String json) throws IOException {
        return new ObjectMapper().readValue(json, List.class).stream()
                .map(item -> ((java.util.Map<String, String>) item).get("id"))
                .toList();
    }

    @Test
    @WithMockUser(username = "testuser")
    void filterItem_whenLoggedIn_shouldReturnFilteredItems() throws Exception {
        appUserRepository.save(new AppUser("2", "testuser", "testpassword"));

        itemRepository.saveAll(List.of(
                Item.builder().id("1").category("Test Category 1").createdBy("2").name("Test name 1").build(),
                Item.builder().id("2").category("Test Category 1").createdBy("2").name("Test name 2").status(Status.RESERVED).build(),
                Item.builder().id("3").category("Test Category 1").createdBy("2").name("Cool item").status(Status.AVAILABLE).build(),
                Item.builder().id("4").category("Test Category 2").createdBy("2").name("Test name 3").status(Status.SOLD).build(),
                Item.builder().id("5").category("Test Category 2").createdBy("2").name("Test name 4").build(),
                Item.builder().id("6").category("Test Category 2").createdBy("1").name("Test name 5").status(Status.RESERVED).build()
           )
        );

       String response1 = mockMvc.perform(MockMvcRequestBuilders.post("/api/items/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"category\":\"Test Category 2\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
       assertThat(extractItemIds(response1)).containsExactlyInAnyOrder("4", "5");

       String response2 = mockMvc.perform(MockMvcRequestBuilders.post("/api/items/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"category\":\"Test Category 1\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
       assertThat(extractItemIds(response2)).containsExactlyInAnyOrder("1", "2", "3");

       String response3 = mockMvc.perform(MockMvcRequestBuilders.post("/api/items/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"AVAILABLE\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
       assertThat(extractItemIds(response3)).containsExactlyInAnyOrder( "3");

       String response4 = mockMvc.perform(MockMvcRequestBuilders.post("/api/items/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"RESERVED\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
       assertThat(extractItemIds(response4)).containsExactlyInAnyOrder( "2");

       String response5 = mockMvc.perform(MockMvcRequestBuilders.post("/api/items/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"test\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
       assertThat(extractItemIds(response5)).containsExactlyInAnyOrder( "1","2", "4", "5");

       String response6 = mockMvc.perform(MockMvcRequestBuilders.post("/api/items/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"test\",\"category\":\"Test Category 1\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
       assertThat(extractItemIds(response6)).containsExactlyInAnyOrder( "1","2");

       String response7 = mockMvc.perform(MockMvcRequestBuilders.post("/api/items/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"test\",\"category\":\"Test Category 1\",\"status\":\"AVAILABLE\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
       assertThat(extractItemIds(response7)).isEmpty();

       String response8 = mockMvc.perform(MockMvcRequestBuilders.post("/api/items/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"createdBy\":\"1\"}")) // createdBy will be overridden by the logged-in user
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
       assertThat(extractItemIds(response8)).containsExactlyInAnyOrder( "1","2","3","4","5");
    }

    @Test
    void updateStatus_whenNotLoggedIn_shouldReturn401() throws Exception {
        mockMvc.perform(patch("/api/items/1/status/AVAILABLE"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "testuser")
    void updateStatus_whenLoggedInAsUser_shouldUpdateStatus() throws Exception {
        appUserRepository.save(new AppUser("2", "testuser", "testpassword"));
        itemRepository.save(Item.builder().id("3").category("Test Category").createdBy("2").name("Name").status(Status.AVAILABLE).build());

        mockMvc.perform(patch("/api/items/3/status/RESERVED"))
                .andExpect(status().isOk());
        assertThat(itemRepository.findById("3").get().getStatus()).isEqualTo(Status.RESERVED);
    }

    @Test
    @WithMockUser(username = "testuser")
    void updateStatus_whenLoggedInAsUser_doesNotUpdateItemOfOtherUser() throws Exception {
        appUserRepository.save(new AppUser("2", "testuser", "testpassword"));
        itemRepository.save(Item.builder().id("4").category("Test Category").createdBy("1").status(Status.AVAILABLE).build());

        mockMvc.perform(patch("/api/items/3/status/RESERVED"))
                .andExpect(status().isOk());
        assertThat(itemRepository.findById("4").get().getStatus()).isEqualTo(Status.AVAILABLE);
    }

    @Test
    @WithMockUser(username = "testuser")
    void updateStatus_whenLoggedInAsUser_doesNothingIfItemNotFound() throws Exception {
        appUserRepository.save(new AppUser("2", "testuser", "testpassword"));
        itemRepository.save(Item.builder().id("4").createdBy("2").name("item name").status(Status.AVAILABLE).build());

        mockMvc.perform(patch("/api/items/3000/status/RESERVED"))
                .andExpect(status().isOk());
        assertThat(itemRepository.findById("4").get().getStatus()).isEqualTo(Status.AVAILABLE);
    }

}
