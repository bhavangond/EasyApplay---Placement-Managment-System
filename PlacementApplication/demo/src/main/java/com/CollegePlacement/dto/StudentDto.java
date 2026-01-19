package com.CollegePlacement.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Data
public class StudentDto {
    private String name;
    private String usn;
    private String branch;
    private String email;
    private String password;
    private Double cgpa;
    private Double percentage10;
    private Double percentage12;
    private Integer backlog;
    private String phone;
	private Boolean placed;
}

