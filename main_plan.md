# Medical Appointment System — Backend Design & Implementation Guide

## Spring Boot + PostgreSQL

---

# Table of Contents

1. Project Overview
2. Database Design & Schema
3. Entity Relationship Diagram
4. Project Structure
5. Dependencies & Configuration
6. Entity Classes
7. Repository Layer
8. Service Layer
9. Controller Layer
10. Data Transfer Objects (DTOs)
11. Database Initialization & Seed Data
12. API Endpoints Reference
13. Testing the API

---

---

# Chapter 1: Project Overview

## What We Are Building

This is a **Medical Appointment Management System** backend. The frontend already exists as a React/TypeScript application with a `data.ts` file containing mock data. Our job is to replace that mock data with a real PostgreSQL database served through a Spring Boot REST API.

## What the System Does

- Stores and retrieves **Doctor** profiles
- Manages **Patient** profiles
- Handles **Appointments** (today, upcoming, scheduled, history)
- Provides **Time Slots** for booking
- Serves **Specialty** lists for filtering

## Technology Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Language   | Java 17                     |
| Framework  | Spring Boot 3.x             |
| Database   | PostgreSQL 15+              |
| ORM        | Spring Data JPA / Hibernate |
| Build Tool | Maven                       |
| API Style  | REST / JSON                 |

## Key Design Decisions

- **No Authentication** for now — all endpoints are open
- **Simple flat structure** — no microservices
- **Follows data.ts exactly** — every field in the TypeScript interfaces maps to a database column
- **Seed data included** — the exact mock data from `data.ts` will be inserted automatically on startup

---

---

# Chapter 2: Database Design & Schema

## Overview of Tables

We need the following tables based on the TypeScript interfaces:

```
patients
doctors
doctor_specialties
doctor_working_hours
time_slots
appointments
```

---

## Table 1: `patients`

Maps directly to the `Patient` interface:

```typescript
export interface Patient {
  name: string;
  email: string;
  phone: string;
  location: string;
  age: number;
  blood: string;
  gender: string;
  avatar: string;
}
```

```sql
CREATE TABLE patients (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(150)        NOT NULL,
    email       VARCHAR(255)        NOT NULL UNIQUE,
    phone       VARCHAR(50),
    location    VARCHAR(255),
    age         INTEGER,
    blood       VARCHAR(10),
    gender      VARCHAR(10),
    avatar      VARCHAR(50),
    created_at  TIMESTAMP           DEFAULT NOW()
);
```

---

## Table 2: `doctors`

Maps to the `Doctor` interface:

```typescript
export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviews: number;
  patientsCount: number;
  avatar: string;
  bio: string;
  consultationFee: number;
  isOnline: boolean;
}
```

```sql
CREATE TABLE doctors (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(150)            NOT NULL,
    specialty           VARCHAR(100)            NOT NULL,
    experience          INTEGER                 DEFAULT 0,
    rating              NUMERIC(3,1)            DEFAULT 0.0,
    reviews             INTEGER                 DEFAULT 0,
    patients_count      INTEGER                 DEFAULT 0,
    avatar              VARCHAR(50),
    bio                 TEXT,
    consultation_fee    NUMERIC(10,2)           DEFAULT 0.00,
    is_online           BOOLEAN                 DEFAULT FALSE,
    created_at          TIMESTAMP               DEFAULT NOW()
);
```

---

## Table 3: `doctor_specialties`

The `Doctor` interface has a `specialties: string[]` array. We store this as a child table.

```sql
CREATE TABLE doctor_specialties (
    id          BIGSERIAL PRIMARY KEY,
    doctor_id   BIGINT          NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    specialty   VARCHAR(100)    NOT NULL
);
```

---

## Table 4: `doctor_working_hours`

Maps to `WorkingHour[]` inside `Doctor`:

```typescript
export interface WorkingHour {
  days: string;
  hours: string;
}
```

```sql
CREATE TABLE doctor_working_hours (
    id          BIGSERIAL PRIMARY KEY,
    doctor_id   BIGINT          NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    days        VARCHAR(100)    NOT NULL,
    hours       VARCHAR(100)    NOT NULL
);
```

---

## Table 5: `time_slots`

Maps to the `TimeSlot` interface:

```typescript
export interface TimeSlot {
  id: number;
  time: string;
  available: boolean;
}
```

```sql
CREATE TABLE time_slots (
    id          BIGSERIAL PRIMARY KEY,
    doctor_id   BIGINT          REFERENCES doctors(id) ON DELETE CASCADE,
    slot_date   DATE            NOT NULL,
    time        VARCHAR(20)     NOT NULL,
    available   BOOLEAN         DEFAULT TRUE
);
```

> **Note:** We add `doctor_id` and `slot_date` so time slots are per-doctor per-day. The frontend `TIME_SLOTS` data is generic, but in the real system slots belong to a specific doctor on a specific date.

---

## Table 6: `appointments`

This is the most important table. It unifies all three appointment interfaces from `data.ts`:

- `Appointment` (history)
- `TodayAppointment`
- `ScheduledAppointment`
- `UpcomingAppointment`

```sql
CREATE TABLE appointments (
    id              BIGSERIAL PRIMARY KEY,
    patient_id      BIGINT          NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id       BIGINT          NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    doctor_name     VARCHAR(150),
    specialty       VARCHAR(100),
    clinic          VARCHAR(200),
    appointment_date DATE           NOT NULL,
    appointment_time VARCHAR(20)    NOT NULL,
    duration        INTEGER         DEFAULT 30,
    status          VARCHAR(20)     NOT NULL DEFAULT 'UPCOMING',
    icon            VARCHAR(20),
    icon_bg         VARCHAR(20),
    created_at      TIMESTAMP       DEFAULT NOW(),

    CONSTRAINT chk_status CHECK (status IN ('COMPLETED','UPCOMING','CANCELLED'))
);
```

---

## Complete SQL Schema File

```sql
-- ================================================
-- schema.sql  –  Medical Appointment System
-- ================================================

DROP TABLE IF EXISTS appointments        CASCADE;
DROP TABLE IF EXISTS time_slots          CASCADE;
DROP TABLE IF EXISTS doctor_working_hours CASCADE;
DROP TABLE IF EXISTS doctor_specialties  CASCADE;
DROP TABLE IF EXISTS doctors             CASCADE;
DROP TABLE IF EXISTS patients            CASCADE;

-- 1. patients
CREATE TABLE patients (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(150)    NOT NULL,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    phone       VARCHAR(50),
    location    VARCHAR(255),
    age         INTEGER,
    blood       VARCHAR(10),
    gender      VARCHAR(10),
    avatar      VARCHAR(50),
    created_at  TIMESTAMP       DEFAULT NOW()
);

-- 2. doctors
CREATE TABLE doctors (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(150)    NOT NULL,
    specialty           VARCHAR(100)    NOT NULL,
    experience          INTEGER         DEFAULT 0,
    rating              NUMERIC(3,1)    DEFAULT 0.0,
    reviews             INTEGER         DEFAULT 0,
    patients_count      INTEGER         DEFAULT 0,
    avatar              VARCHAR(50),
    bio                 TEXT,
    consultation_fee    NUMERIC(10,2)   DEFAULT 0.00,
    is_online           BOOLEAN         DEFAULT FALSE,
    created_at          TIMESTAMP       DEFAULT NOW()
);

-- 3. doctor_specialties
CREATE TABLE doctor_specialties (
    id          BIGSERIAL PRIMARY KEY,
    doctor_id   BIGINT      NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    specialty   VARCHAR(100) NOT NULL
);

-- 4. doctor_working_hours
CREATE TABLE doctor_working_hours (
    id          BIGSERIAL PRIMARY KEY,
    doctor_id   BIGINT      NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    days        VARCHAR(100) NOT NULL,
    hours       VARCHAR(100) NOT NULL
);

-- 5. time_slots
CREATE TABLE time_slots (
    id          BIGSERIAL PRIMARY KEY,
    doctor_id   BIGINT      REFERENCES doctors(id) ON DELETE CASCADE,
    slot_date   DATE        NOT NULL,
    time        VARCHAR(20) NOT NULL,
    available   BOOLEAN     DEFAULT TRUE
);

-- 6. appointments
CREATE TABLE appointments (
    id               BIGSERIAL PRIMARY KEY,
    patient_id       BIGINT      NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id        BIGINT      NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    doctor_name      VARCHAR(150),
    specialty        VARCHAR(100),
    clinic           VARCHAR(200),
    appointment_date DATE        NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    duration         INTEGER     DEFAULT 30,
    status           VARCHAR(20) NOT NULL DEFAULT 'UPCOMING',
    icon             VARCHAR(20),
    icon_bg          VARCHAR(20),
    created_at       TIMESTAMP   DEFAULT NOW(),
    CONSTRAINT chk_status CHECK (status IN ('COMPLETED','UPCOMING','CANCELLED'))
);
```

---

---

# Chapter 3: Project Structure

```
src/
└── main/
    ├── java/
    │   └── com/
    │       └── medical/
    │           └── app/
    │               ├── MedicalAppApplication.java
    │               ├── config/
    │               │   └── CorsConfig.java
    │               ├── controller/
    │               │   ├── DoctorController.java
    │               │   ├── PatientController.java
    │               │   ├── AppointmentController.java
    │               │   └── TimeSlotController.java
    │               ├── dto/
    │               │   ├── DoctorDTO.java
    │               │   ├── PatientDTO.java
    │               │   ├── AppointmentDTO.java
    │               │   ├── TimeSlotDTO.java
    │               │   └── WorkingHourDTO.java
    │               ├── entity/
    │               │   ├── Doctor.java
    │               │   ├── DoctorSpecialty.java
    │               │   ├── DoctorWorkingHour.java
    │               │   ├── Patient.java
    │               │   ├── Appointment.java
    │               │   └── TimeSlot.java
    │               ├── repository/
    │               │   ├── DoctorRepository.java
    │               │   ├── PatientRepository.java
    │               │   ├── AppointmentRepository.java
    │               │   └── TimeSlotRepository.java
    │               └── service/
    │                   ├── DoctorService.java
    │                   ├── PatientService.java
    │                   ├── AppointmentService.java
    │                   └── TimeSlotService.java
    └── resources/
        ├── application.properties
        └── data.sql
```

---

---

# Chapter 4: Dependencies & Configuration

## `pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.medical</groupId>
    <artifactId>app</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>Medical Appointment System</name>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>

        <!-- Spring Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- PostgreSQL Driver -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

---

## `application.properties`

```properties
# ── Server ──────────────────────────────────────────
server.port=8080

# ── PostgreSQL ───────────────────────────────────────
spring.datasource.url=jdbc:postgresql://localhost:5432/medical_db
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=org.postgresql.Driver

# ── JPA / Hibernate ──────────────────────────────────
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# ── Seed Data ────────────────────────────────────────
spring.sql.init.mode=always
spring.jpa.defer-datasource-initialization=true

# ── Jackson ──────────────────────────────────────────
spring.jackson.serialization.write-dates-as-timestamps=false
```

> **Create the database first:**
>
> ```sql
> CREATE DATABASE medical_db;
> ```

---

---

# Chapter 5: Entity Classes

## `Patient.java`

```java
package com.medical.app.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(length = 255)
    private String location;

    private Integer age;

    @Column(length = 10)
    private String blood;

    @Column(length = 10)
    private String gender;

    @Column(length = 50)
    private String avatar;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
```

---

## `Doctor.java`

```java
package com.medical.app.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String specialty;

    private Integer experience;

    @Column(precision = 3, scale = 1)
    private BigDecimal rating;

    private Integer reviews;

    @Column(name = "patients_count")
    private Integer patientsCount;

    @Column(length = 50)
    private String avatar;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "consultation_fee", precision = 10, scale = 2)
    private BigDecimal consultationFee;

    @Column(name = "is_online")
    private Boolean isOnline;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // One doctor → many specialty tags
    @OneToMany(mappedBy = "doctor",
               cascade = CascadeType.ALL,
               orphanRemoval = true,
               fetch = FetchType.EAGER)
    @Builder.Default
    private List<DoctorSpecialty> specialties = new ArrayList<>();

    // One doctor → many working-hour rows
    @OneToMany(mappedBy = "doctor",
               cascade = CascadeType.ALL,
               orphanRemoval = true,
               fetch = FetchType.EAGER)
    @Builder.Default
    private List<DoctorWorkingHour> workingHours = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
```

---

## `DoctorSpecialty.java`

```java
package com.medical.app.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctor_specialties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorSpecialty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @ToString.Exclude
    private Doctor doctor;

    @Column(nullable = false, length = 100)
    private String specialty;
}
```

---

## `DoctorWorkingHour.java`

```java
package com.medical.app.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctor_working_hours")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorWorkingHour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @ToString.Exclude
    private Doctor doctor;

    @Column(nullable = false, length = 100)
    private String days;

    @Column(nullable = false, length = 100)
    private String hours;
}
```

---

## `TimeSlot.java`

```java
package com.medical.app.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "time_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    @ToString.Exclude
    private Doctor doctor;

    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;

    @Column(nullable = false, length = 20)
    private String time;

    @Column(nullable = false)
    private Boolean available;
}
```

---

## `Appointment.java`

```java
package com.medical.app.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @ToString.Exclude
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @ToString.Exclude
    private Doctor doctor;

    @Column(name = "doctor_name", length = 150)
    private String doctorName;

    @Column(length = 100)
    private String specialty;

    @Column(length = 200)
    private String clinic;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "appointment_time", nullable = false, length = 20)
    private String appointmentTime;

    private Integer duration;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(length = 20)
    private String icon;

    @Column(name = "icon_bg", length = 20)
    private String iconBg;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "UPCOMING";
        if (this.duration == null) this.duration = 30;
    }
}
```

---

---

# Chapter 6: Repository Layer

## `PatientRepository.java`

```java
package com.medical.app.repository;

import com.medical.app.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

---

## `DoctorRepository.java`

```java
package com.medical.app.repository;

import com.medical.app.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findBySpecialtyIgnoreCase(String specialty);

    List<Doctor> findByIsOnline(Boolean isOnline);

    @Query("SELECT d FROM Doctor d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.specialty) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Doctor> searchByNameOrSpecialty(@Param("keyword") String keyword);

    @Query("SELECT DISTINCT d.specialty FROM Doctor d ORDER BY d.specialty")
    List<String> findAllSpecialties();
}
```

---

## `AppointmentRepository.java`

```java
package com.medical.app.repository;

import com.medical.app.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // All appointments for a patient
    List<Appointment> findByPatientId(Long patientId);

    // Appointments by status for a patient
    List<Appointment> findByPatientIdAndStatus(Long patientId, String status);

    // Today's appointments for a patient
    List<Appointment> findByPatientIdAndAppointmentDate(
            Long patientId, LocalDate date);

    // Upcoming appointments (date >= today)
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId " +
           "AND a.appointmentDate >= :today AND a.status = 'UPCOMING' " +
           "ORDER BY a.appointmentDate ASC, a.appointmentTime ASC")
    List<Appointment> findUpcomingByPatient(
            @Param("patientId") Long patientId,
            @Param("today") LocalDate today);

    // All appointments for a doctor
    List<Appointment> findByDoctorId(Long doctorId);
}
```

---

## `TimeSlotRepository.java`

```java
package com.medical.app.repository;

import com.medical.app.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findByDoctorIdAndSlotDate(Long doctorId, LocalDate slotDate);

    List<TimeSlot> findByDoctorIdAndSlotDateAndAvailable(
            Long doctorId, LocalDate slotDate, Boolean available);
}
```

---

---

# Chapter 7: DTOs (Data Transfer Objects)

DTOs are what we send back to the frontend — they match the TypeScript interfaces exactly.

## `WorkingHourDTO.java`

```java
package com.medical.app.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkingHourDTO {
    private String days;
    private String hours;
}
```

## `DoctorDTO.java`

```java
package com.medical.app.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDTO {
    private Long id;
    private String name;
    private String specialty;
    private Integer experience;
    private BigDecimal rating;
    private Integer reviews;
    private Integer patientsCount;
    private String avatar;
    private String bio;
    private List<String> specialties;
    private List<WorkingHourDTO> workingHours;
    private BigDecimal consultationFee;
    private Boolean isOnline;
}
```

## `PatientDTO.java`

```java
package com.medical.app.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String location;
    private Integer age;
    private String blood;
    private String gender;
    private String avatar;
}
```

## `AppointmentDTO.java`

```java
package com.medical.app.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDTO {
    private Long id;
    private Long doctorId;
    private Long patientId;
    private String doctorName;
    private String specialty;
    private String clinic;
    private LocalDate appointmentDate;
    private String appointmentTime;
    private Integer duration;
    private String status;
    private String icon;
    private String iconBg;
}
```

## `TimeSlotDTO.java`

```java
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
```

## `CreateAppointmentDTO.java`

```java
package com.medical.app.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAppointmentDTO {
    private Long patientId;
    private Long doctorId;
    private String clinic;
    private LocalDate appointmentDate;
    private String appointmentTime;
    private Integer duration;
    private String icon;
    private String iconBg;
}
```

---

---

# Chapter 8: Service Layer

## `DoctorService.java`

```java
package com.medical.app.service;

import com.medical.app.dto.DoctorDTO;
import com.medical.app.dto.WorkingHourDTO;
import com.medical.app.entity.Doctor;
import com.medical.app.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;

    // ── Get all doctors ──────────────────────────────
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Get doctor by ID ─────────────────────────────
    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + id));
        return toDTO(doctor);
    }

    // ── Get doctors by specialty ─────────────────────
    public List<DoctorDTO> getDoctorsBySpecialty(String specialty) {
        if (specialty == null || specialty.equalsIgnoreCase("All")) {
            return getAllDoctors();
        }
        return doctorRepository.findBySpecialtyIgnoreCase(specialty)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Search doctors ───────────────────────────────
    public List<DoctorDTO> searchDoctors(String keyword) {
        return doctorRepository.searchByNameOrSpecialty(keyword)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Get all specialty names ──────────────────────
    public List<String> getAllSpecialties() {
        List<String> specialties = doctorRepository.findAllSpecialties();
        specialties.add(0, "All");
        return specialties;
    }

    // ── Get online doctors ───────────────────────────
    public List<DoctorDTO> getOnlineDoctors() {
        return doctorRepository.findByIsOnline(true)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Entity → DTO mapping ─────────────────────────
    public DoctorDTO toDTO(Doctor doctor) {
        List<String> specialtyNames = doctor.getSpecialties()
                .stream()
                .map(s -> s.getSpecialty())
                .collect(Collectors.toList());

        List<WorkingHourDTO> workingHourDTOs = doctor.getWorkingHours()
                .stream()
                .map(wh -> WorkingHourDTO.builder()
                        .days(wh.getDays())
                        .hours(wh.getHours())
                        .build())
                .collect(Collectors.toList());

        return DoctorDTO.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .specialty(doctor.getSpecialty())
                .experience(doctor.getExperience())
                .rating(doctor.getRating())
                .reviews(doctor.getReviews())
                .patientsCount(doctor.getPatientsCount())
                .avatar(doctor.getAvatar())
                .bio(doctor.getBio())
                .specialties(specialtyNames)
                .workingHours(workingHourDTOs)
                .consultationFee(doctor.getConsultationFee())
                .isOnline(doctor.getIsOnline())
                .build();
    }
}
```

---

## `PatientService.java`

```java
package com.medical.app.service;

import com.medical.app.dto.PatientDTO;
import com.medical.app.entity.Patient;
import com.medical.app.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found: " + id));
        return toDTO(patient);
    }

    public PatientDTO getPatientByEmail(String email) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient not found: " + email));
        return toDTO(patient);
    }

    public PatientDTO createPatient(PatientDTO dto) {
        Patient patient = Patient.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .location(dto.getLocation())
                .age(dto.getAge())
                .blood(dto.getBlood())
                .gender(dto.getGender())
                .avatar(dto.getAvatar())
                .build();
        return toDTO(patientRepository.save(patient));
    }

    public PatientDTO updatePatient(Long id, PatientDTO dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found: " + id));
        patient.setName(dto.getName());
        patient.setEmail(dto.getEmail());
        patient.setPhone(dto.getPhone());
        patient.setLocation(dto.getLocation());
        patient.setAge(dto.getAge());
        patient.setBlood(dto.getBlood());
        patient.setGender(dto.getGender());
        patient.setAvatar(dto.getAvatar());
        return toDTO(patientRepository.save(patient));
    }

    private PatientDTO toDTO(Patient p) {
        return PatientDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .email(p.getEmail())
                .phone(p.getPhone())
                .location(p.getLocation())
                .age(p.getAge())
                .blood(p.getBlood())
                .gender(p.getGender())
                .avatar(p.getAvatar())
                .build();
    }
}
```

---

## `AppointmentService.java`

```java
package com.medical.app.service;

import com.medical.app.dto.AppointmentDTO;
import com.medical.app.dto.CreateAppointmentDTO;
import com.medical.app.entity.Appointment;
import com.medical.app.entity.Doctor;
import com.medical.app.entity.Patient;
import com.medical.app.repository.AppointmentRepository;
import com.medical.app.repository.DoctorRepository;
import com.medical.app.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository     patientRepository;
    private final DoctorRepository      doctorRepository;

    // ── All appointments for a patient ───────────────
    public List<AppointmentDTO> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Today's appointments ─────────────────────────
    public List<AppointmentDTO> getTodayAppointments(Long patientId) {
        return appointmentRepository
                .findByPatientIdAndAppointmentDate(patientId, LocalDate.now())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Upcoming appointments ────────────────────────
    public List<AppointmentDTO> getUpcomingAppointments(Long patientId) {
        return appointmentRepository
                .findUpcomingByPatient(patientId, LocalDate.now())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Appointment history (COMPLETED) ─────────────
    public List<AppointmentDTO> getHistory(Long patientId) {
        return appointmentRepository
                .findByPatientIdAndStatus(patientId, "COMPLETED")
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Book a new appointment ───────────────────────
    public AppointmentDTO createAppointment(CreateAppointmentDTO req) {
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .doctorName(doctor.getName())
                .specialty(doctor.getSpecialty())
                .clinic(req.getClinic())
                .appointmentDate(req.getAppointmentDate())
                .appointmentTime(req.getAppointmentTime())
                .duration(req.getDuration() != null ? req.getDuration() : 30)
                .status("UPCOMING")
                .icon(req.getIcon())
                .iconBg(req.getIconBg())
                .build();

        return toDTO(appointmentRepository.save(appointment));
    }

    // ── Cancel an appointment ────────────────────────
    public AppointmentDTO cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus("CANCELLED");
        return toDTO(appointmentRepository.save(appointment));
    }

    // ── Complete an appointment ──────────────────────
    public AppointmentDTO completeAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus("COMPLETED");
        return toDTO(appointmentRepository.save(appointment));
    }

    // ── Entity → DTO ─────────────────────────────────
    private AppointmentDTO toDTO(Appointment a) {
        return AppointmentDTO.builder()
                .id(a.getId())
                .doctorId(a.getDoctor().getId())
                .patientId(a.getPatient().getId())
                .doctorName(a.getDoctorName())
                .specialty(a.getSpecialty())
                .clinic(a.getClinic())
                .appointmentDate(a.getAppointmentDate())
                .appointmentTime(a.getAppointmentTime())
                .duration(a.getDuration())
                .status(a.getStatus())
                .icon(a.getIcon())
                .iconBg(a.getIconBg())
                .build();
    }
}
```

---

## `TimeSlotService.java`

```java
package com.medical.app.service;

import com.medical.app.dto.TimeSlotDTO;
import com.medical.app.entity.TimeSlot;
import com.medical.app.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    public List<TimeSlotDTO> getSlotsForDoctorOnDate(Long doctorId, LocalDate date) {
        return timeSlotRepository
                .findByDoctorIdAndSlotDate(doctorId, date)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<TimeSlotDTO> getAvailableSlots(Long doctorId, LocalDate date) {
        return timeSlotRepository
                .findByDoctorIdAndSlotDateAndAvailable(doctorId, date, true)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Mark a slot as booked
    public TimeSlotDTO bookSlot(Long slotId) {
        TimeSlot slot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        slot.setAvailable(false);
        return toDTO(timeSlotRepository.save(slot));
    }

    private TimeSlotDTO toDTO(TimeSlot ts) {
        return TimeSlotDTO.builder()
                .id(ts.getId())
                .doctorId(ts.getDoctor() != null ? ts.getDoctor().getId() : null)
                .slotDate(ts.getSlotDate())
                .time(ts.getTime())
                .available(ts.getAvailable())
                .build();
    }
}
```

---

---

# Chapter 9: Controller Layer

## `DoctorController.java`

```java
package com.medical.app.controller;

import com.medical.app.dto.DoctorDTO;
import com.medical.app.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;

    // GET /api/doctors
    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors(
            @RequestParam(required = false) String specialty,
            @RequestParam(required = false) String search) {

        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(doctorService.searchDoctors(search));
        }
        if (specialty != null && !specialty.isBlank()) {
            return ResponseEntity.ok(doctorService.getDoctorsBySpecialty(specialty));
        }
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    // GET /api/doctors/{id}
    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    // GET /api/doctors/specialties
    @GetMapping("/specialties")
    public ResponseEntity<List<String>> getSpecialties() {
        return ResponseEntity.ok(doctorService.getAllSpecialties());
    }

    // GET /api/doctors/online
    @GetMapping("/online")
    public ResponseEntity<List<DoctorDTO>> getOnlineDoctors() {
        return ResponseEntity.ok(doctorService.getOnlineDoctors());
    }
}
```

---

## `PatientController.java`

```java
package com.medical.app.controller;

import com.medical.app.dto.PatientDTO;
import com.medical.app.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;

    // GET /api/patients/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatient(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    // GET /api/patients/email/{email}
    @GetMapping("/email/{email}")
    public ResponseEntity<PatientDTO> getPatientByEmail(@PathVariable String email) {
        return ResponseEntity.ok(patientService.getPatientByEmail(email));
    }

    // POST /api/patients
    @PostMapping
    public ResponseEntity<PatientDTO> createPatient(@RequestBody PatientDTO dto) {
        return ResponseEntity.ok(patientService.createPatient(dto));
    }

    // PUT /api/patients/{id}
    @PutMapping("/{id}")
    public ResponseEntity<PatientDTO> updatePatient(
            @PathVariable Long id, @RequestBody PatientDTO dto) {
        return ResponseEntity.ok(patientService.updatePatient(id, dto));
    }
}
```

---

## `AppointmentController.java`

```java
package com.medical.app.controller;

import com.medical.app.dto.AppointmentDTO;
import com.medical.app.dto.CreateAppointmentDTO;
import com.medical.app.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    // GET /api/appointments/patient/{patientId}
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentDTO>> getPatientAppointments(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(
                appointmentService.getPatientAppointments(patientId));
    }

    // GET /api/appointments/patient/{patientId}/today
    @GetMapping("/patient/{patientId}/today")
    public ResponseEntity<List<AppointmentDTO>> getTodayAppointments(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(
                appointmentService.getTodayAppointments(patientId));
    }

    // GET /api/appointments/patient/{patientId}/upcoming
    @GetMapping("/patient/{patientId}/upcoming")
    public ResponseEntity<List<AppointmentDTO>> getUpcomingAppointments(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(
                appointmentService.getUpcomingAppointments(patientId));
    }

    // GET /api/appointments/patient/{patientId}/history
    @GetMapping("/patient/{patientId}/history")
    public ResponseEntity<List<AppointmentDTO>> getHistory(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(
                appointmentService.getHistory(patientId));
    }

    // POST /api/appointments
    @PostMapping
    public ResponseEntity<AppointmentDTO> createAppointment(
            @RequestBody CreateAppointmentDTO dto) {
        return ResponseEntity.ok(
                appointmentService.createAppointment(dto));
    }

    // PATCH /api/appointments/{id}/cancel
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<AppointmentDTO> cancelAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }

    // PATCH /api/appointments/{id}/complete
    @PatchMapping("/{id}/complete")
    public ResponseEntity<AppointmentDTO> completeAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.completeAppointment(id));
    }
}
```

---

## `TimeSlotController.java`

```java
package com.medical.app.controller;

import com.medical.app.dto.TimeSlotDTO;
import com.medical.app.service.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timeslots")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    // GET /api/timeslots/doctor/{doctorId}?date=2025-05-12
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<TimeSlotDTO>> getSlots(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                LocalDate date,
            @RequestParam(required = false) Boolean available) {

        if (Boolean.TRUE.equals(available)) {
            return ResponseEntity.ok(
                    timeSlotService.getAvailableSlots(doctorId, date));
        }
        return ResponseEntity.ok(
                timeSlotService.getSlotsForDoctorOnDate(doctorId, date));
    }

    // PATCH /api/timeslots/{id}/book
    @PatchMapping("/{id}/book")
    public ResponseEntity<TimeSlotDTO> bookSlot(@PathVariable Long id) {
        return ResponseEntity.ok(timeSlotService.bookSlot(id));
    }
}
```

---

---

# Chapter 10: CORS Configuration

## `CorsConfig.java`

```java
package com.medical.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```

---

---

# Chapter 11: Main Application & Seed Data

## `MedicalAppApplication.java`

```java
package com.medical.app;

import com.medical.app.entity.*;
import com.medical.app.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class MedicalAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedicalAppApplication.class, args);
    }

    @Bean
    CommandLineRunner seedDatabase(
            DoctorRepository     doctorRepo,
            PatientRepository    patientRepo,
            AppointmentRepository apptRepo,
            TimeSlotRepository   slotRepo) {

        return args -> {

            // ── 1. Seed Patients ──────────────────────────────────
            Patient sarah = Patient.builder()
                    .name("Sarah Jenkins")
                    .email("sarah.jenkins@gmail.com")
                    .phone("+1 (555) 234-8901")
                    .location("Portland, OR")
                    .age(28).blood("O+").gender("F").avatar("👩")
                    .build();
            patientRepo.save(sarah);

            // ── 2. Seed Doctors ───────────────────────────────────

            // Doctor 1
            Doctor d1 = Doctor.builder()
                    .name("Dr. Julian Sterling")
                    .specialty("Cardiologist")
                    .experience(12)
                    .rating(new BigDecimal("4.9"))
                    .reviews(120).patientsCount(2400)
                    .avatar("👨‍⚕️")
                    .bio("Expert cardiologist specializing in non-invasive " +
                         "heart procedures and preventive care.")
                    .consultationFee(new BigDecimal("120.00"))
                    .isOnline(true).build();

            d1.getSpecialties().addAll(List.of(
                    DoctorSpecialty.builder().doctor(d1).specialty("Cardiology").build(),
                    DoctorSpecialty.builder().doctor(d1).specialty("Heart Surgery").build(),
                    DoctorSpecialty.builder().doctor(d1).specialty("Diagnostic Imaging").build(),
                    DoctorSpecialty.builder().doctor(d1).specialty("Preventive Care").build()
            ));
            d1.getWorkingHours().addAll(List.of(
                    DoctorWorkingHour.builder().doctor(d1)
                            .days("Mon – Fri").hours("09:00 AM – 06:00 PM").build(),
                    DoctorWorkingHour.builder().doctor(d1)
                            .days("Saturday").hours("10:00 AM – 02:00 PM").build()
            ));
            doctorRepo.save(d1);

            // Doctor 2
            Doctor d2 = Doctor.builder()
                    .name("Dr. Sarah Jenkins")
                    .specialty("Cardiologist")
                    .experience(8)
                    .rating(new BigDecimal("4.8"))
                    .reviews(98).patientsCount(1800)
                    .avatar("👩‍⚕️")
                    .bio("Specialist in cardiovascular diagnostics and " +
                         "patient-centered heart care.")
                    .consultationFee(new BigDecimal("100.00"))
                    .isOnline(true).build();

            d2.getSpecialties().addAll(List.of(
                    DoctorSpecialty.builder().doctor(d2).specialty("Cardiology").build(),
                    DoctorSpecialty.builder().doctor(d2).specialty("Echocardiography").build(),
                    DoctorSpecialty.builder().doctor(d2).specialty("Preventive Care").build()
            ));
            d2.getWorkingHours().add(
                    DoctorWorkingHour.builder().doctor(d2)
                            .days("Mon – Fri").hours("08:00 AM – 05:00 PM").build()
            );
            doctorRepo.save(d2);

            // Doctor 3
            Doctor d3 = Doctor.builder()
                    .name("Dr. Michael Chen")
                    .specialty("General Physician")
                    .experience(15)
                    .rating(new BigDecimal("4.7"))
                    .reviews(210).patientsCount(3100)
                    .avatar("🧑‍⚕️")
                    .bio("General practitioner focused on holistic and preventive medicine.")
                    .consultationFee(new BigDecimal("80.00"))
                    .isOnline(false).build();

            d3.getSpecialties().addAll(List.of(
                    DoctorSpecialty.builder().doctor(d3).specialty("General Medicine").build(),
                    DoctorSpecialty.builder().doctor(d3).specialty("Internal Medicine").build(),
                    DoctorSpecialty.builder().doctor(d3).specialty("Preventive Care").build()
            ));
            d3.getWorkingHours().add(
                    DoctorWorkingHour.builder().doctor(d3)
                            .days("Mon – Sat").hours("09:00 AM – 07:00 PM").build()
            );
            doctorRepo.save(d3);

            // Doctor 4 – 8 (find-doctor page doctors)
            Doctor d4 = Doctor.builder().name("Dr. Sarah Ahmed")
                    .specialty("Cardiology").experience(10)
                    .rating(new BigDecimal("4.8")).reviews(0).patientsCount(0)
                    .avatar("🫀").bio("").consultationFee(new BigDecimal("50.00"))
                    .isOnline(true).build();
            d4.getSpecialties().add(
                    DoctorSpecialty.builder().doctor(d4).specialty("Cardiology").build());
            doctorRepo.save(d4);

            Doctor d5 = Doctor.builder().name("Dr. John Smith")
                    .specialty("Dermatology").experience(8)
                    .rating(new BigDecimal("4.6")).reviews(0).patientsCount(0)
                    .avatar("🧴").bio("").consultationFee(new BigDecimal("40.00"))
                    .isOnline(true).build();
            d5.getSpecialties().add(
                    DoctorSpecialty.builder().doctor(d5).specialty("Dermatology").build());
            doctorRepo.save(d5);

            Doctor d6 = Doctor.builder().name("Dr. Emily Brown")
                    .specialty("Neurology").experience(12)
                    .rating(new BigDecimal("4.9")).reviews(0).patientsCount(0)
                    .avatar("🧠").bio("").consultationFee(new BigDecimal("70.00"))
                    .isOnline(false).build();
            d6.getSpecialties().add(
                    DoctorSpecialty.builder().doctor(d6).specialty("Neurology").build());
            doctorRepo.save(d6);

            Doctor d7 = Doctor.builder().name("Dr. Ahmed Ali")
                    .specialty("Orthopedics").experience(9)
                    .rating(new BigDecimal("4.7")).reviews(0).patientsCount(0)
                    .avatar("🦴").bio("").consultationFee(new BigDecimal("55.00"))
                    .isOnline(true).build();
            d7.getSpecialties().add(
                    DoctorSpecialty.builder().doctor(d7).specialty("Orthopedics").build());
            doctorRepo.save(d7);

            Doctor d8 = Doctor.builder().name("Dr. Lisa Green")
                    .specialty("Pediatrics").experience(7)
                    .rating(new BigDecimal("4.5")).reviews(0).patientsCount(0)
                    .avatar("👶").bio("").consultationFee(new BigDecimal("45.00"))
                    .isOnline(true).build();
            d8.getSpecialties().add(
                    DoctorSpecialty.builder().doctor(d8).specialty("Pediatrics").build());
            doctorRepo.save(d8);

            // ── 3. Seed Time Slots (for d1, today) ───────────────
            LocalDate today = LocalDate.now();
            List<TimeSlot> slots = List.of(
                    TimeSlot.builder().doctor(d1).slotDate(today)
                            .time("09:00 AM").available(true).build(),
                    TimeSlot.builder().doctor(d1).slotDate(today)
                            .time("10:30 AM").available(true).build(),
                    TimeSlot.builder().doctor(d1).slotDate(today)
                            .time("11:00 AM").available(true).build(),
                    TimeSlot.builder().doctor(d1).slotDate(today)
                            .time("01:45 PM").available(true).build(),
                    TimeSlot.builder().doctor(d1).slotDate(today)
                            .time("03:00 PM").available(false).build(),
                    TimeSlot.builder().doctor(d1).slotDate(today)
                            .time("04:30 PM").available(true).build()
            );
            slotRepo.saveAll(slots);

            // ── 4. Seed Appointments ──────────────────────────────
            Appointment a1 = Appointment.builder()
                    .patient(sarah).doctor(d1)
                    .doctorName("Dr. Marcus Thorne")
                    .specialty("General Check-up")
                    .clinic("City Medical Center")
                    .appointmentDate(LocalDate.of(2024, 3, 12))
                    .appointmentTime("10:00 AM")
                    .duration(30).status("COMPLETED")
                    .icon("🩺").iconBg("#E8F4F8").build();
            apptRepo.save(a1);

            Appointment a2 = Appointment.builder()
                    .patient(sarah).doctor(d2)
                    .doctorName("City Dental Care")
                    .specialty("Dental Cleaning")
                    .clinic("City Dental Care")
                    .appointmentDate(LocalDate.of(2024, 1, 15))
                    .appointmentTime("02:00 PM")
                    .duration(30).status("COMPLETED")
                    .icon("🦷").iconBg("#FEF0E8").build();
            apptRepo.save(a2);

            // Upcoming
            Appointment a3 = Appointment.builder()
                    .patient(sarah).doctor(d2)
                    .doctorName("Dr. Sarah Jenkins")
                    .specialty("Cardiology")
                    .clinic("Heart Care Center")
                    .appointmentDate(today)
                    .appointmentTime("09:30 AM")
                    .duration(30).status("UPCOMING")
                    .icon("❤️").iconBg("#FFE8E8").build();
            apptRepo.save(a3);

            Appointment a4 = Appointment.builder()
                    .patient(sarah).doctor(d3)
                    .doctorName("Dr. Michael Chen")
                    .specialty("General Health")
                    .clinic("General Health Clinic")
                    .appointmentDate(today)
                    .appointmentTime("02:15 PM")
                    .duration(30).status("UPCOMING")
                    .icon("🩺").iconBg("#E8F4F8").build();
            apptRepo.save(a4);

            System.out.println("✅ Seed data loaded successfully!");
        };
    }
}
```

---

---

# Chapter 12: API Endpoints Reference

## Complete API Table

| Method  | Endpoint                                                    | Description              |
| ------- | ----------------------------------------------------------- | ------------------------ |
| `GET`   | `/api/doctors`                                              | Get all doctors          |
| `GET`   | `/api/doctors?specialty=Cardiology`                         | Filter by specialty      |
| `GET`   | `/api/doctors?search=sarah`                                 | Search doctors           |
| `GET`   | `/api/doctors/{id}`                                         | Get one doctor           |
| `GET`   | `/api/doctors/specialties`                                  | All specialty names      |
| `GET`   | `/api/doctors/online`                                       | Online doctors only      |
| `GET`   | `/api/patients/{id}`                                        | Get patient by ID        |
| `GET`   | `/api/patients/email/{email}`                               | Get patient by email     |
| `POST`  | `/api/patients`                                             | Create new patient       |
| `PUT`   | `/api/patients/{id}`                                        | Update patient           |
| `GET`   | `/api/appointments/patient/{id}`                            | All patient appointments |
| `GET`   | `/api/appointments/patient/{id}/today`                      | Today's appointments     |
| `GET`   | `/api/appointments/patient/{id}/upcoming`                   | Upcoming appointments    |
| `GET`   | `/api/appointments/patient/{id}/history`                    | Completed history        |
| `POST`  | `/api/appointments`                                         | Book appointment         |
| `PATCH` | `/api/appointments/{id}/cancel`                             | Cancel appointment       |
| `PATCH` | `/api/appointments/{id}/complete`                           | Complete appointment     |
| `GET`   | `/api/timeslots/doctor/{id}?date=2025-05-12`                | All slots for date       |
| `GET`   | `/api/timeslots/doctor/{id}?date=2025-05-12&available=true` | Available slots          |
| `PATCH` | `/api/timeslots/{id}/book`                                  | Mark slot as booked      |

---

---

# Chapter 13: Testing the API

## Quick Test with curl

```bash
# Get all doctors
curl http://localhost:8082/api/doctors

# Get doctors filtered by specialty
curl "http://localhost:8082/api/doctors?specialty=Cardiology"

# Search doctors
curl "http://localhost:8082/api/doctors?search=sarah"

# Get single doctor
curl http://localhost:8082/api/doctors/1

# Get patient
curl http://localhost:8082/api/patients/1

# Get today's appointments for patient 1
curl http://localhost:8082/api/appointments/patient/1/today

# Get upcoming appointments
curl http://localhost:8082/api/appointments/patient/1/upcoming

# Book an appointment
curl -X POST http://localhost:8082/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": 1,
    "doctorId": 1,
    "clinic": "Heart Care Center",
    "appointmentDate": "2025-06-01",
    "appointmentTime": "09:00 AM",
    "duration": 30,
    "icon": "❤️",
    "iconBg": "#FFE8E8"
  }'

# Cancel appointment
curl -X PATCH http://localhost:8082/api/appointments/1/cancel

# Get time slots
curl "http://localhost:8082/api/timeslots/doctor/1?date=2025-05-12"

# Get available slots only
curl "http://localhost:8082/api/timeslots/doctor/1?date=2025-05-12&available=true"
```

---

## Expected JSON Response — Doctor

```json
{
  "id": 1,
  "name": "Dr. Julian Sterling",
  "specialty": "Cardiologist",
  "experience": 12,
  "rating": 4.9,
  "reviews": 120,
  "patientsCount": 2400,
  "avatar": "👨‍⚕️",
  "bio": "Expert cardiologist specializing in non-invasive heart procedures.",
  "specialties": [
    "Cardiology",
    "Heart Surgery",
    "Diagnostic Imaging",
    "Preventive Care"
  ],
  "workingHours": [
    { "days": "Mon – Fri", "hours": "09:00 AM – 06:00 PM" },
    { "days": "Saturday", "hours": "10:00 AM – 02:00 PM" }
  ],
  "consultationFee": 120.0,
  "isOnline": true
}
```

---

## Expected JSON Response — Appointment

```json
{
  "id": 1,
  "doctorId": 1,
  "patientId": 1,
  "doctorName": "Dr. Julian Sterling",
  "specialty": "Cardiologist",
  "clinic": "Heart Care Center",
  "appointmentDate": "2025-06-01",
  "appointmentTime": "09:00 AM",
  "duration": 30,
  "status": "UPCOMING",
  "icon": "❤️",
  "iconBg": "#FFE8E8"
}
```

---

## Starting the Application

```bash
# 1. Make sure PostgreSQL is running and medical_db exists
psql -U postgres -c "CREATE DATABASE medical_db;"

# 2. Update application.properties with your password

# 3. Run the Spring Boot app
mvn spring-boot:run

# 4. App will start on http://localhost:8082
# 5. Seed data inserts automatically on first run
```

---

_This document covers the complete backend design and implementation for the Medical Appointment System. The API is designed to replace every piece of mock data in `data.ts` with real database-backed endpoints. Authentication can be added later using Spring Security + JWT without changing the existing structure._
