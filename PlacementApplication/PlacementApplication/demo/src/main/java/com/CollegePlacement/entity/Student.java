package com.CollegePlacement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String usn;

    private String branch;

    @Column(unique = true)
    private String email;

    @ToString.Exclude
    private String password; // store BCrypt hash

    private Double cgpa;
    private Double percentage10;
    private Double percentage12;

    private String resumeUrl; // store file path or S3 link later

    private Boolean autoApply = false;

    private Instant createdAt = Instant.now();
    
    private String role;
    
    private String resumePath;
    
    private Integer backlogs;

    private String phone;
    
    private Boolean placed = false;

}

