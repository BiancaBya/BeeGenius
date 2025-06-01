package com.beegenius.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "ratings")
@CompoundIndexes({
        @CompoundIndex(name = "user_material_idx", def = "{'user': 1, 'material': 1}", unique = true)
})
public class Rating {

    @Id
    private String id;

    private int value;

    @DBRef(lazy = true)
    private User user;

    @DBRef(lazy = true)
    private Material material;
}
