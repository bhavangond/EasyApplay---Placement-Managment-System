package com.CollegePlacement.service;

import com.CollegePlacement.entity.Admin;
import com.CollegePlacement.entity.Student;
import com.CollegePlacement.repository.AdminRepository;
import com.CollegePlacement.repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService {
    private final StudentRepository studentRepo;
    private final AdminRepository adminRepo;

    public CustomUserDetailsService(StudentRepository studentRepo, AdminRepository adminRepo) {
        this.studentRepo = studentRepo;
        this.adminRepo = adminRepo;
    }

    // We use email as username for both roles; prefix role in token usage is optional
    public Student findStudentByEmail(String email) {
        return studentRepo.findByEmail(email).orElse(null);
    }

    public Admin findAdminByEmail(String email) {
        return adminRepo.findByEmail(email).orElse(null);
    }
}
