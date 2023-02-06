package de.neuefische.backend.service;

import de.neuefische.backend.model.Item;
import de.neuefische.backend.model.Status;
import de.neuefische.backend.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.springframework.data.domain.ExampleMatcher.GenericPropertyMatchers.contains;
import static org.springframework.data.domain.ExampleMatcher.GenericPropertyMatchers.exact;


@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final AppUserService appUserService;

    private String getCurrentUserId() {
        return appUserService.getAuthenticatedUserId();
    }

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
        if (item.getStatus() == null) {
            item.setStatus(Status.AVAILABLE);
        }
        item.setCreatedBy(getCurrentUserId());
        return itemRepository
                .save(item);
    }

    public Item update(Item item) {
        return saveItem(item);
    }

    public void delete(String id) {
        itemRepository
                .deleteById(id);
    }

    public void updateStatus(String id, Status newStatus) {
        itemRepository.findByIdAndCreatedBy(id, getCurrentUserId())
                .ifPresent(item -> {
                    item.setStatus(newStatus);
                    itemRepository.save(item);
                });
    }

    public List<Item> filterItems(final Item exampleItem) {
        final ExampleMatcher matcherObject = ExampleMatcher.matching()
                .withIgnoreNullValues()
                .withIgnorePaths(
                        "id",
                        "price",
                        "description",
                        "image"
                )
                .withMatcher("name", contains().ignoreCase())
                .withMatcher("category", exact())
                .withMatcher("createdBy", exact())
                .withMatcher("status", exact());
        exampleItem.setCreatedBy(getCurrentUserId());
        Example<Item> example = Example.of(exampleItem, matcherObject);
        return itemRepository.findAll(example);
    }
}
