package de.neuefische.backend.service;

import de.neuefische.backend.model.Item;
import de.neuefische.backend.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final AppUserService appUserService;

    public List<Item> getAll() {
        return itemRepository
                .findAllByCreatedBy(getCurrentUserId());
    }

    public Item getById(String id) throws Exception {
        return itemRepository
                .findById(id)
                .orElseThrow(() -> new Exception("Item with id " + id + " is nonexistent."));
    }

    public Item create(Item item) {
        return saveItem(item);
    }

    private Item saveItem(Item item) {
        item.setCreatedBy(getCurrentUserId());
        return itemRepository
                .save(item);
    }

    private String getCurrentUserId() {
        return appUserService.getAuthenticatedUser().getId();
    }

    public Item update(Item item) {
        return saveItem(item);
    }

    public void delete(String id) {
        itemRepository
                .deleteById(id);
    }
}
