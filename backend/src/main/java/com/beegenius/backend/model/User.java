package com.beegenius.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "users")
public class User extends BaseEntity {

    private String firstName;

    private String lastName;

    @Indexed(unique = true)
    private String email;

    private String password;

}
