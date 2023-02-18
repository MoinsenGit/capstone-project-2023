package de.neuefische.backend.service;

import de.neuefische.backend.model.CsvImportResult;
import de.neuefische.backend.model.Image;
import de.neuefische.backend.model.Item;
import de.neuefische.backend.model.Status;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

import static org.apache.logging.log4j.util.Strings.isBlank;

@Service
@RequiredArgsConstructor
public class CsvService {
    public static final String NAME = "name";
    public static final String PRICE = "price";
    public static final String DESCRIPTION = "description";
    public static final String IMAGE_URL = "imageUrl";
    public static final String CATEGORY = "category";
    public static final String STATUS = "status";
    private static final String[] HEADERS = {NAME, PRICE, DESCRIPTION, IMAGE_URL, CATEGORY, STATUS};

    private final ItemService itemService;

    public CsvImportResult importCsv(final Reader reader) throws IOException  {
        List<String> errors = new ArrayList<>();
        List<Item> items = new ArrayList<>();
        System.out.println("importCsv");
        Iterable<CSVRecord> records = CSVFormat.DEFAULT.builder()
                .setSkipHeaderRecord(true)
                .setHeader(HEADERS)
                .build().parse(reader);
        for (CSVRecord record : records) {
            try {
                String name = record.get(NAME);
                Assert.hasText(name, "Name is required");
                String csvPrice = record.get(PRICE);
                Double price = isBlank(csvPrice) ? null : Double.parseDouble(csvPrice);
String description = record.get(DESCRIPTION);
Assert.hasText(description, "Description is required");
String imageUrl = record.get(IMAGE_URL);
System.out.println("imageUrl: " + imageUrl);
Assert.hasText(imageUrl, "Image URL is required");
                String csvCategory = record.get(CATEGORY);
                String category = isBlank(csvCategory) ? null : csvCategory;
                String csvStatus = record.get(STATUS);
                Status status = isBlank(csvStatus) ? null : Status.valueOf(csvStatus.toUpperCase());
                final Item item = Item.builder()
                        .name(name)
                        .price(price)
                        .description(description)
                        .image(Image.builder().url(imageUrl).build())
                        .category(category)
                        .status(status)
                        .build();
                final Item savedItem = itemService.create(item);
                items.add(savedItem);
            } catch (RuntimeException e) {
                errors.add("Error in line " +record.getRecordNumber() + ", can not import item: " + e.getMessage());
            }
        }
return new CsvImportResult(items, errors);
    }
}
