package com.CollegePlacement.controller;

import com.CollegePlacement.entity.ApplicationEntity;
import com.CollegePlacement.service.FileStorageService;
import com.CollegePlacement.service.ApplicationService;

import jakarta.servlet.http.HttpServletRequest;

import com.CollegePlacement.entity.Job;
import com.CollegePlacement.entity.Student;
import com.CollegePlacement.repository.ApplicationRepository;
import com.CollegePlacement.repository.JobRepository;
import com.CollegePlacement.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/student")
public class StudentController {
    private final StudentRepository studentRepo;
    private final JobRepository jobRepo;
    private final ApplicationRepository applicationRepo;
    private final ApplicationService applicationService;

    public StudentController(StudentRepository studentRepo, JobRepository jobRepo, ApplicationRepository applicationRepo, ApplicationService applicationService) {
        this.studentRepo = studentRepo;
        this.jobRepo = jobRepo;
        this.applicationRepo = applicationRepo;
        this.applicationService=applicationService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestAttribute(value = "email", required = false) String email) {
        if (email == null) return ResponseEntity.status(401).body("Unauthorized");
        var sOpt = studentRepo.findByEmail(email);
        return sOpt.<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(404).body("Student not found"));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Student updated, @RequestAttribute(value = "email", required = false) String email) {
        if (email == null) return ResponseEntity.status(401).body("Unauthorized");
        var sOpt = studentRepo.findByEmail(email);
        if (sOpt.isEmpty()) return ResponseEntity.status(404).body("Student not found");
        Student s = sOpt.get();
        s.setBranch(updated.getBranch());
        s.setCgpa(updated.getCgpa());
        s.setPercentage10(updated.getPercentage10());
        s.setPercentage12(updated.getPercentage12());
        // update other fields as required
        studentRepo.save(s);
        return ResponseEntity.ok(s);
    }

    

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> listJobs() {
        return ResponseEntity.ok(jobRepo.findAll());
    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<?> applyToJob(
            HttpServletRequest request,
            @PathVariable Long jobId
    ) {
        try {
            String email = (String) request.getAttribute("email");
            if (email == null)
                return ResponseEntity.status(401).body("Unauthorized");

            String msg = applicationService.applyForJob(email, jobId);
            return ResponseEntity.ok(msg);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/applied")
    public ResponseEntity<?> getApplied(@RequestAttribute(value = "email", required = false) String email) {
        if (email == null) return ResponseEntity.status(401).body("Unauthorized");
        Optional<Student> sOpt = studentRepo.findByEmail(email);
        if (sOpt.isEmpty()) return ResponseEntity.status(404).body("Student not found");
        List<ApplicationEntity> apps = applicationRepo.findByStudent(sOpt.get());
        return ResponseEntity.ok(apps);
    }
    
    @PostMapping("/upload-resume")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestAttribute(value = "email", required = false) String email) {

        try {
            if (email == null)
                return ResponseEntity.status(401).body("Unauthorized");

            Optional<Student> st = studentRepo.findByEmail(email);
            if (st.isEmpty())
                return ResponseEntity.status(404).body("Student not found");

            Student s = st.get();

            // Create upload directory if not exists
            Path uploadDir = Paths.get("uploads/resumes/");
            Files.createDirectories(uploadDir);

            // Clean filename
            String originalName = StringUtils.cleanPath(file.getOriginalFilename());

            // Unique stored name
            String storedName = s.getUsn() + "_" + System.currentTimeMillis() + "_" + originalName;

            Path filePath = uploadDir.resolve(storedName);

            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Save path in DB
            s.setResumePath(filePath.toString());
            studentRepo.save(s);

            return ResponseEntity.ok("Resume uploaded successfully!");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading resume: " + e.getMessage());
        }
    }
    

}

