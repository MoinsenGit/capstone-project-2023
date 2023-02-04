package de.neuefische.backend.controller;

import de.neuefische.backend.model.Item;
import de.neuefische.backend.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/items")
public class ItemController {
    private final ItemService itemService;

    @PostMapping
    public Item create(@RequestBody Item item) {
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
    public Item update(@PathVariable String id, @RequestBody Item item) {
        item.setId(id);
        return itemService.update(item);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable String id) {
        itemService.delete(id);
    }

}
