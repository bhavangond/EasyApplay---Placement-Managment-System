package com.CollegePlacement.repository;

import com.CollegePlacement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    Optional<Student> findByUsn(String usn);
    boolean existsByEmail(String email);
    boolean existsByUsn(String usn);
}

