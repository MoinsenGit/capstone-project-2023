package de.neuefische.backend.service;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.client.gridfs.model.GridFSFile;
import de.neuefische.backend.model.FileData;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FileService {
    public static final String CREATED_BY = "createdBy";
    public static final String CONTENT_TYPE = "_contentType";
    private final GridFsTemplate gridFsTemplate;


    public FileData saveFile (MultipartFile multipartFile) throws IOException {
        if (multipartFile.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty"
            );
        }

       final String userName = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        ObjectId objectId = gridFsTemplate.store(
                multipartFile.getInputStream(),
                multipartFile.getOriginalFilename(),
                multipartFile.getContentType(),
                BasicDBObjectBuilder.start()
                        .add(CREATED_BY, userName)
                        .get()
        );

        return getFileData(objectId.toString());
    }

    public GridFsResource getResource(String id) {
        return gridFsTemplate.getResource(getFile(id));
    }

    public FileData getFileData (String id) {
        GridFSFile gridFSFile = getFile(id);

        Document metadata = Optional
                .ofNullable(gridFSFile.getMetadata())
                .orElse(new Document(Map.of(
                        CONTENT_TYPE, "",
                        CREATED_BY, ""
                )));

        return new FileData(
                id,
                "/api/files/" + id,
                gridFSFile.getFilename(),
                metadata.getString(CONTENT_TYPE),
                gridFSFile.getLength(),
                metadata.getString(CREATED_BY)
        );
    }

    public GridFSFile getFile(String id) {
        return Optional.ofNullable(
                gridFsTemplate.findOne(
                        Query.query(Criteria.where("_id").is(id))
                )
        ).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found")
        );
    }
}
