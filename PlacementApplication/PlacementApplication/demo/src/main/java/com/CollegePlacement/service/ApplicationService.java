package com.CollegePlacement.service;

import com.CollegePlacement.entity.*;
import com.CollegePlacement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final StudentRepository studentRepo;
    private final JobRepository jobRepo;
    private final ApplicationRepository applicationRepo;

    public String applyForJob(String studentEmail, Long jobId) {

        Student s = studentRepo.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Prevent duplicate
        applicationRepo.findByJobAndStudent(job, s)
                .ifPresent(a -> { throw new RuntimeException("Already applied"); });

        // ONLY 2 ELIGIBILITY RULES
        validateEligibility(s, job);

        ApplicationEntity app = ApplicationEntity.builder()
                .job(job)
                .student(s)
                .status("APPLIED")
                .appliedAt(LocalDateTime.now())
                .build();

        applicationRepo.save(app);
        return "Successfully applied!";
    }

    private void validateEligibility(Student s, Job job) {

        // Rule 1: Check CGPA
        if (job.getMinCgpa() != null) {
            Double studentCgpa = s.getCgpa() == null ? 0.0 : s.getCgpa();
            if (studentCgpa < job.getMinCgpa())
                throw new RuntimeException("Not eligible: CGPA too low");
        }

        // Rule 2: Check branch match
        if (job.getAllowedBranches() != null&&!job.getAllowedBranches().equals("All")) {
            var branchList = Arrays.asList(job.getAllowedBranches().split(","));
            String studentBranch = s.getBranch();
            if (studentBranch == null || !branchList.contains(studentBranch))
                throw new RuntimeException("Not eligible: Branch not allowed");
        }
    }
    // Get all applications
    public List<ApplicationEntity> getAllApplications() {
        return applicationRepo.findAll();
    }

    // Update status (SHORTLISTED / SELECTED)
    public ApplicationEntity updateApplicationStatus(Long applicationId, String status) {
        ApplicationEntity application = applicationRepo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status.toUpperCase());
        if ("SELECTED".equals(status)) {
            Student student = application.getStudent();
            student.setPlaced(true);
            studentRepo.save(student);
        }
        return applicationRepo.save(application);
    }
   
}

