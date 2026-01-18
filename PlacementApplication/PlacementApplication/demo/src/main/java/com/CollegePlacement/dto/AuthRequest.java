package com.CollegePlacement.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Data
public class AuthRequest {
    private String email;
    private String password;
}

