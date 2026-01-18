package com.CollegePlacement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admins")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Data
public class Admin {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    @ToString.Exclude
    private String password;
    
    private String role;
}
