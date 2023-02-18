package de.neuefische.backend.controller;

import de.neuefische.backend.model.Item;
import de.neuefische.backend.model.Status;
import de.neuefische.backend.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import javax.validation.Valid;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/items")
public class ItemController {
    private final ItemService itemService;

    @PostMapping
    public Item create(@Valid @RequestBody Item item) {
        return itemService.create(item);
    }

    @GetMapping
    public List<Item> getAll() {
        return itemService.getAll();
    }

    @PostMapping("/filter")
    public List<Item> filterItems(@RequestBody Item exampleItem) {
        return itemService.filterItems(exampleItem);
    }

    @GetMapping("/{id}")
    public Item getById(@PathVariable String id) throws Exception {
        return itemService.getById(id);
    }

    @PutMapping("/{id}")
    public Item update(@PathVariable String id, @Valid @RequestBody Item item) {
        item.setId(id);
        return itemService.update(item);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable String id) {
        itemService.delete(id);
    }

    @PatchMapping("/{id}/status/{newStatus}")
    public void updateStatus(@PathVariable String id, @PathVariable Status newStatus) {
        itemService.updateStatus(id, newStatus);
    }
}
