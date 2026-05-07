package com.medical.app.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeSlotDTO {
    private Long id;
    private Long doctorId;
    private LocalDate slotDate;
    private String time;
    private Boolean available;
}