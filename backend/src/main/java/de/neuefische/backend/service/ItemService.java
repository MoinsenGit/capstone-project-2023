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

    public List<Item> getAll() {
        return itemRepository.findAll();
    }

    public Item getById(String id) throws Exception {
        return itemRepository.findById(id).orElseThrow(() -> new Exception("Item with id " + id + " is nonexistent."));
    }

    public Item create(Item item) {
        return itemRepository.save(item);
    }

    public Item update(Item item) {
        return itemRepository.save(item);
    }

    public void delete(String id) {
        itemRepository.deleteById(id);
    }


}
