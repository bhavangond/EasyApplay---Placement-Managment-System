package com.CollegePlacement.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {

    private final String RESUME_DIR = "uploads/resumes/";
    private final String JD_DIR = "uploads/jobdescriptions/";

    public String saveResume(MultipartFile file, String usn) throws IOException {

        // Create directory if not exists
        File directory = new File(RESUME_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Add timestamp to avoid overwriting
        String fileName = usn + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

        // Build full path
        Path filePath = Paths.get(RESUME_DIR, fileName);

        // Copy file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return relative path
        return RESUME_DIR + fileName;
    }

    public String saveJobDescription(MultipartFile file, String companyName) throws IOException {

        File directory = new File(JD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = companyName + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path filePath = Paths.get(JD_DIR, fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return JD_DIR + fileName;
    }
}

