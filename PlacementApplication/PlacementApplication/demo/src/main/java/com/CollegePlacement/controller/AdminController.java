package com.CollegePlacement.controller;

import com.CollegePlacement.entity.Admin;
import com.CollegePlacement.entity.ApplicationEntity;
import com.CollegePlacement.entity.Job;
import com.CollegePlacement.entity.Student;
import com.CollegePlacement.repository.StudentRepository;
import com.CollegePlacement.repository.AdminRepository;
import com.CollegePlacement.repository.JobRepository;
import com.CollegePlacement.service.ApplicationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/admin")
public class AdminController {

    private final JobRepository jobRepo;
    private final AdminRepository adminRepo;
    private final ApplicationService applicationService;
    private final StudentRepository studentRepo;

    public AdminController(JobRepository jobRepo, AdminRepository adminRepo, ApplicationService applicationService, StudentRepository studentRepo) {
        this.jobRepo = jobRepo;
        this.adminRepo = adminRepo;
        this.applicationService = applicationService;
        this.studentRepo = studentRepo;
    }

    // -----------------------------------------------------------------------------------
    // 0) Get All Registered Students
    // -----------------------------------------------------------------------------------
    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        System.out.println("AdminController: Received request for getAllStudents");
        return ResponseEntity.ok(studentRepo.findAll());
    }

    // -----------------------------------------------------------------------------------
    // 1) Create Admin (ONLY for initial setup — you can remove after first admin is created)
    // -----------------------------------------------------------------------------------
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        admin.setRole("ROLE_ADMIN");
        admin.setPassword(encoder.encode(admin.getPassword()));  // HASH HERE

        Admin saved = adminRepo.save(admin);
        return ResponseEntity.ok(saved);
    }


    // -----------------------------------------------------------------------------------
    // 2) Create Job
    // Email will come from JWT — backend ensures only admin can create jobs
    // -----------------------------------------------------------------------------------
    @PostMapping("/job")
    public ResponseEntity<?> createJob(@RequestBody Job job,
                                       @RequestAttribute(value = "email", required = false) String email) {

        if (email == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        adminRepo.findByEmail(email).ifPresent(job::setCreatedBy);

        Job saved = jobRepo.save(job);
        return ResponseEntity.ok(saved);
    }

    // -----------------------------------------------------------------------------------
    // 3) Get all jobs (admin can view everything)
    // -----------------------------------------------------------------------------------
    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobRepo.findAll());
    }

    // -----------------------------------------------------------------------------------
    // 4) Get open jobs (deadline not crossed)
    // -----------------------------------------------------------------------------------
    @GetMapping("/jobs/open")
    public ResponseEntity<List<Job>> getOpenJobs() {
        List<Job> jobs = jobRepo.findByDeadlineAfter(LocalDate.now());
        return ResponseEntity.ok(jobs);
    }

    // -----------------------------------------------------------------------------------
    // 5) Upload Job Description (PDF) for a Job
    // -----------------------------------------------------------------------------------
    @PostMapping("/job/{jobId}/upload-jd")
    public ResponseEntity<?> uploadJobDescription(
            @PathVariable Long jobId,
            @RequestParam("file") MultipartFile file,
            @RequestAttribute(value = "email", required = false) String email
    ) {
        if (email == null)
            return ResponseEntity.status(401).body("Unauthorized");

        var adminOpt = adminRepo.findByEmail(email);
        if (adminOpt.isEmpty())
            return ResponseEntity.status(403).body("Only admin can upload JD");

        var jobOpt = jobRepo.findById(jobId);
        if (jobOpt.isEmpty())
            return ResponseEntity.status(404).body("Job not found");

        Job job = jobOpt.get();

        try {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());

            Path uploadDir = Paths.get("uploads/jds");
            Files.createDirectories(uploadDir);

            // filename format → jobId_timestamp_filename
            String storedName = "JOB_" + jobId + "_" + System.currentTimeMillis() + "_" + fileName;
            Path filePath = uploadDir.resolve(storedName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            job.setJobDescriptionUrl(filePath.toString());
            jobRepo.save(job);

            return ResponseEntity.ok("Job Description uploaded successfully!");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    // -----------------------------------------------------------------------------------
    // 6) Delete Job
    // -----------------------------------------------------------------------------------
    @DeleteMapping("/job/{jobId}")
    public ResponseEntity<?> deleteJob(
            @PathVariable Long jobId,
            @RequestAttribute(value = "email", required = false) String email
    ) {
        if (email == null)
            return ResponseEntity.status(401).body("Unauthorized");

        var adminOpt = adminRepo.findByEmail(email);
        if (adminOpt.isEmpty())
            return ResponseEntity.status(403).body("Only admin can delete jobs");

        var jobOpt = jobRepo.findById(jobId);
        if (jobOpt.isEmpty())
            return ResponseEntity.status(404).body("Job not found");

        jobRepo.deleteById(jobId);
        return ResponseEntity.ok("Job deleted successfully");
    }

    // -----------------------------------------------------------------------------------
    // 7) Update Job
    // -----------------------------------------------------------------------------------
    @PutMapping("/job/{jobId}")
    public ResponseEntity<?> updateJob(
            @PathVariable Long jobId,
            @RequestBody Job jobUpdate,
            @RequestAttribute(value = "email", required = false) String email
    ) {
        if (email == null)
            return ResponseEntity.status(401).body("Unauthorized");

        var adminOpt = adminRepo.findByEmail(email);
        if (adminOpt.isEmpty())
            return ResponseEntity.status(403).body("Only admin can update jobs");

        var jobOpt = jobRepo.findById(jobId);
        if (jobOpt.isEmpty())
            return ResponseEntity.status(404).body("Job not found");

        Job job = jobOpt.get();
        if (jobUpdate.getCompanyName() != null) job.setCompanyName(jobUpdate.getCompanyName());
        if (jobUpdate.getRole() != null) job.setRole(jobUpdate.getRole());
        if (jobUpdate.getMinCgpa() != null) job.setMinCgpa(jobUpdate.getMinCgpa());
        if (jobUpdate.getDeadline() != null) job.setDeadline(jobUpdate.getDeadline());
        if (jobUpdate.getAllowedBranches() != null) job.setAllowedBranches(jobUpdate.getAllowedBranches());
        if (jobUpdate.getDriveDetails() != null) job.setDriveDetails(jobUpdate.getDriveDetails());
        if (jobUpdate.getStipend() != null) job.setStipend(jobUpdate.getStipend());
        if (jobUpdate.getOaDate() != null) job.setOaDate(jobUpdate.getOaDate());
        if (jobUpdate.getInterviewDate() != null) job.setInterviewDate(jobUpdate.getInterviewDate());

        Job updated = jobRepo.save(job);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public List<ApplicationEntity> getAllApplications() {
        return applicationService.getAllApplications();
    }

    // 2️⃣ Update application status
    @PutMapping("/{applicationId}/status")
    public ApplicationEntity updateStatus(
            @PathVariable Long applicationId,
            @RequestParam String status
    ) {
        // status = SHORTLISTED or SELECTED
        return applicationService.updateApplicationStatus(applicationId, status);
    }
}

