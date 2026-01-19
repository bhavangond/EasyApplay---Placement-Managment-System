package com.CollegePlacement.repository;

import com.CollegePlacement.entity.ApplicationEntity;
import com.CollegePlacement.entity.Job;
import com.CollegePlacement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<ApplicationEntity, Long> {
    List<ApplicationEntity> findByStudent(Student student);
    List<ApplicationEntity> findByJob(Job job);
    Optional<ApplicationEntity> findByJobAndStudent(Job job, Student student);

    List<ApplicationEntity> findByJobId(Long jobId);

    List<ApplicationEntity> findByStatus(String status);
}

