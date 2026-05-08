package com.medical.app.repository;

import com.medical.app.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

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

    Optional<Doctor> findByEmail(String email);

    boolean existsByEmail(String email);
}
