package com.CollegePlacement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications", uniqueConstraints = @UniqueConstraint(columnNames = {"job_id","student_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Data
public class ApplicationEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Job job;

    @ManyToOne
    private Student student;

    private String status = "APPLIED";

    private LocalDateTime appliedAt = LocalDateTime.now();
   
}

