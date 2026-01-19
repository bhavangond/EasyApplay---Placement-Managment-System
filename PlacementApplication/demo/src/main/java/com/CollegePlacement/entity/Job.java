package com.CollegePlacement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "jobs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Job {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String role;

    @Column(length=2000)
    private String driveDetails;

    private String oaDate;
    private String interviewDate;

    private LocalDate deadline;
    
    private Double minCgpa;
    
    private String allowedBranches; // "CSE,ISE,ECE"


    private String jobDescriptionUrl; // pdf link

    private String stipend;

    private Instant createdAt = Instant.now();

    @ManyToOne(fetch = FetchType.LAZY)
    private Admin createdBy;
}
