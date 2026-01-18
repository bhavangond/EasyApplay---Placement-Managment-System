package com.CollegePlacement.repository;

import com.CollegePlacement.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByDeadlineAfter(LocalDate date);
}

