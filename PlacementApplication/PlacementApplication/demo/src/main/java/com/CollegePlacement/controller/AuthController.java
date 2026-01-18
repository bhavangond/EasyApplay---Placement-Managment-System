package com.CollegePlacement.controller;

import com.CollegePlacement.dto.AuthRequest;
import com.CollegePlacement.dto.AuthResponse;
import com.CollegePlacement.dto.StudentDto;
import com.CollegePlacement.entity.Admin;
import com.CollegePlacement.entity.Student;
import com.CollegePlacement.repository.AdminRepository;
import com.CollegePlacement.repository.StudentRepository;
import com.CollegePlacement.service.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final StudentRepository studentRepo;
    private final AdminRepository adminRepo;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(StudentRepository studentRepo, AdminRepository adminRepo, JwtUtil jwtUtil) {
        this.studentRepo = studentRepo;
        this.adminRepo = adminRepo;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register-student")
    public ResponseEntity<?> registerStudent(@RequestBody StudentDto dto) {

        if (!dto.getEmail().endsWith("@rvce.edu.in")) {
            return ResponseEntity.badRequest().body("Only @rvce.edu.in emails are allowed");
        }
        if (studentRepo.existsByEmail(dto.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        if (studentRepo.existsByUsn(dto.getUsn())) {
            return ResponseEntity.badRequest().body("USN already exists");
        }

        Student s = Student.builder()
                .name(dto.getName())
                .usn(dto.getUsn())
                .branch(dto.getBranch())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .cgpa(dto.getCgpa())
                .percentage10(dto.getPercentage10())
                .percentage12(dto.getPercentage12())
                .role("ROLE_STUDENT")
                .backlogs(dto.getBacklog())
                .phone(dto.getPhone())
                .placed(false)
                .build();

        studentRepo.save(s);
        String token = jwtUtil.generateToken(s.getEmail(),s.getRole());

        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {

        var stOpt = studentRepo.findByEmail(req.getEmail());
        if (stOpt.isPresent()) {
            Student s = stOpt.get();
            if (passwordEncoder.matches(req.getPassword(), s.getPassword())) {
                return ResponseEntity.ok(new AuthResponse(jwtUtil.generateToken(s.getEmail(),s.getRole())));
            }
        }

        var adOpt = adminRepo.findByEmail(req.getEmail());
        if (adOpt.isPresent()) {
            Admin a = adOpt.get();
            if (passwordEncoder.matches(req.getPassword(), a.getPassword())) {
                return ResponseEntity.ok(new AuthResponse(jwtUtil.generateToken(a.getEmail(),a.getRole())));
            }
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }
}


