package de.neuefische.backend.repository;

import de.neuefische.backend.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
    Optional<Item> findByIdAndCreatedBy(String id, String createdBy);

    List<Item> findAllByCreatedBy(String createdBy);
}
