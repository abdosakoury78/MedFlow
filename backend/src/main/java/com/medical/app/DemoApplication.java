package com.medical.app;

import com.medical.app.dto.AppointmentDTO;
import com.medical.app.dto.CreateAppointmentDTO;
import com.medical.app.dto.DoctorSignupRequest;
import com.medical.app.dto.PatientSignupRequest;
import com.medical.app.dto.WorkingHourDTO;
import com.medical.app.entity.Doctor;
import com.medical.app.entity.Patient;
import com.medical.app.entity.TimeSlot;
import com.medical.app.repository.AppointmentRepository;
import com.medical.app.repository.DoctorRepository;
import com.medical.app.repository.PatientRepository;
import com.medical.app.repository.TimeSlotRepository;
import com.medical.app.service.AppointmentService;
import com.medical.app.service.DoctorService;
import com.medical.app.service.PatientService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public org.springframework.boot.CommandLineRunner seedDemoData(
			PatientService patientService,
			DoctorService doctorService,
			AppointmentService appointmentService,
			PatientRepository patientRepository,
			DoctorRepository doctorRepository,
			AppointmentRepository appointmentRepository,
			TimeSlotRepository timeSlotRepository) {
		return args -> {
			for (PatientSignupRequest request : demoPatients()) {
				if (!patientRepository.existsByEmail(request.getEmail())) {
					patientService.createPatient(request);
				}
			}

			for (DoctorSignupRequest request : demoDoctors()) {
				if (!doctorRepository.existsByEmail(request.getEmail())) {
					doctorService.createDoctor(request);
				}
			}

			seedTimeSlots(timeSlotRepository, doctorRepository);
			seedAppointments(appointmentService, appointmentRepository, patientRepository, doctorRepository);
		};
	}

	private List<PatientSignupRequest> demoPatients() {
		return List.of(
				createPatient("Ahmed Ali", "ahmed.ali@medflow.com", "Ahmed@12345", "01012345678", "Giza", 25, "O+",
						"male", "../../../assets/avatars/boy.png"),
				createPatient("Sara Adel", "sara.adel@medflow.com", "Sara@2026", "01123456789", "Cairo", 22, "A+",
						"female", "../../../assets/avatars/girl.png"),
				createPatient("Omar Hassan", "omar.hassan@medflow.com", "Omar#7788", "01234567890", "Alexandria", 31,
						"B+", "male", "../../../assets/avatars/boy.png"),
				createPatient("Mona Farid", "mona.farid@medflow.com", "Mona!4411", "01098765432", "Mansoura", 27, "AB+",
						"female", "../../../assets/avatars/girl.png"),
				createPatient("Youssef Nabil", "youssef.nabil@medflow.com", "Youssef2026!", "01155667788", "Tanta", 29,
						"O-", "male", "../../../assets/avatars/boy.png"),
				createPatient("Hana Mahmoud", "hana.mahmoud@medflow.com", "Hana$8899", "01266778899", "Zagazig", 24,
						"A-", "female", "../../../assets/avatars/girl.png"),
				createPatient("Khaled Samir", "khaled.samir@medflow.com", "Khaled@3456", "01024681357", "Beni Suef", 34,
						"B-", "male", "../../../assets/avatars/boy.png"),
				createPatient("Dina Youssef", "dina.youssef@medflow.com", "Dina2026#1", "01122334455", "Fayoum", 21,
						"O+", "female", "../../../assets/avatars/girl.png"),
				createPatient("Mostafa Adel", "mostafa.adel@medflow.com", "Mostafa!778", "01233445566", "Ismailia", 38,
						"A+", "male", "../../../assets/avatars/boy.png"),
				createPatient("Nourhan Tarek", "nourhan.tarek@medflow.com", "Nourhan@26", "01055667799", "Port Said",
						26, "AB-", "female", "../../../assets/avatars/girl.png"),
				createPatient("Mahmoud Gamal", "mahmoud.gamal@medflow.com", "Mahmoud#900", "01177889900", "Helwan", 30,
						"O+", "male", "../../../assets/avatars/boy.png"),
				createPatient("Salma Ibrahim", "salma.ibrahim@medflow.com", "Salma!5522", "01299001122",
						"6th of October", 23, "B+", "female", "../../../assets/avatars/girl.png"),
				// ✅ ADDED: Missing patient used in seedAppointments
				createPatient("Laila Hamed", "laila.hamed@medflow.com", "Laila@2026!", "01166778899", "Cairo", 26,
						"O+", "female", "../../../assets/avatars/girl.png"));
	}

	private List<DoctorSignupRequest> demoDoctors() {
		return List.of(
				createDoctor("Dr. Julian Sterling", "Cardiologist", "julian.sterling@medflow.com", "Julian@12345", 12,
						new BigDecimal("4.9"), 120, 2400, "assets/avatars/doctor-boy.png",
						"Expert cardiologist specializing in non-invasive heart procedures and preventive care.",
						new BigDecimal("120.00"), true, List.of("Cardiology", "Preventive Care", "Hypertension"),
						List.of(
								createWorkingHour("Sun-Thu", "9:00 AM - 3:00 PM"),
								createWorkingHour("Sat", "10:00 AM - 1:00 PM"))),
				createDoctor("Dr. Layla Mansour", "Dermatologist", "layla.mansour@medflow.com", "Layla@2026", 9,
						new BigDecimal("4.8"), 96, 1820, "assets/avatars/doctor-girl.png",
						"Dermatology specialist focused on acne treatment, skin allergy management, and cosmetic consultations.",
						new BigDecimal("110.00"), true, List.of("Dermatology", "Cosmetic Care", "Skin Allergy"),
						List.of(
								createWorkingHour("Sun-Thu", "10:00 AM - 4:00 PM"),
								createWorkingHour("Sat", "11:00 AM - 2:00 PM"))),
				createDoctor("Dr. Karim Adel", "Orthopedic Surgeon", "karim.adel@medflow.com", "Karim#7788", 15,
						new BigDecimal("4.7"), 143, 3180, "assets/avatars/doctor-boy.png",
						"Orthopedic surgeon handling fractures, sports injuries, and joint replacement evaluation.",
						new BigDecimal("150.00"), false, List.of("Orthopedics", "Sports Medicine", "Fracture Care"),
						List.of(
								createWorkingHour("Sat-Wed", "1:00 PM - 7:00 PM"),
								createWorkingHour("Thu", "9:00 AM - 12:00 PM"))),
				createDoctor("Dr. Noor Hassan", "Pediatrician", "noor.hassan@medflow.com", "Noor!4411", 8,
						new BigDecimal("4.9"), 88, 1490, "assets/avatars/doctor-girl.png",
						"Pediatric care for infants, children, and routine developmental follow-up visits.",
						new BigDecimal("95.00"), true, List.of("Pediatrics", "Child Development", "Vaccination"),
						List.of(
								createWorkingHour("Sun-Thu", "8:00 AM - 2:00 PM"),
								createWorkingHour("Sat", "9:00 AM - 12:00 PM"))),
				createDoctor("Dr. Omar Fathy", "Neurologist", "omar.fathy@medflow.com", "Omar2026$", 13,
						new BigDecimal("4.6"), 104, 2110, "assets/avatars/doctor-boy.png",
						"Neurology consults for headaches, neuropathy, seizures, and stroke prevention.",
						new BigDecimal("140.00"), false, List.of("Neurology", "Stroke Care", "Headache Clinic"),
						List.of(
								createWorkingHour("Mon-Fri", "11:00 AM - 5:00 PM"),
								createWorkingHour("Sat", "12:00 PM - 3:00 PM"))),
				createDoctor("Dr. Salma Nader", "Gynecologist", "salma.nader@medflow.com", "Salma@8899", 10,
						new BigDecimal("4.8"), 111, 2265, "assets/avatars/doctor-girl.png",
						"Women's health specialist for prenatal care, fertility support, and routine examinations.",
						new BigDecimal("130.00"), true, List.of("Gynecology", "Prenatal Care", "Fertility"),
						List.of(
								createWorkingHour("Sun-Thu", "9:30 AM - 4:30 PM"),
								createWorkingHour("Fri", "10:00 AM - 1:00 PM"))),
				createDoctor("Dr. Hani Saber", "ENT Specialist", "hani.saber@medflow.com", "Hani@3456", 11,
						new BigDecimal("4.5"), 79, 1735, "assets/avatars/doctor-boy.png",
						"ENT consultations for sinus problems, ear infections, and throat conditions.",
						new BigDecimal("100.00"), true, List.of("ENT", "Sinus Care", "Hearing Tests"),
						List.of(
								createWorkingHour("Sat-Thu", "12:00 PM - 6:00 PM"),
								createWorkingHour("Fri", "2:00 PM - 5:00 PM"))),
				createDoctor("Dr. Dina Farouk", "Endocrinologist", "dina.farouk@medflow.com", "Dina#3311", 14,
						new BigDecimal("4.9"), 132, 2750, "assets/avatars/doctor-girl.png",
						"Endocrinology care for diabetes, thyroid disorders, and hormonal imbalance treatment.",
						new BigDecimal("145.00"), false, List.of("Endocrinology", "Diabetes Care", "Thyroid Care"),
						List.of(
								createWorkingHour("Mon-Fri", "10:00 AM - 3:00 PM"),
								createWorkingHour("Sat", "9:00 AM - 12:00 PM"))),
				createDoctor("Dr. Mostafa Rami", "Psychiatrist", "mostafa.rami@medflow.com", "Mostafa!778", 7,
						new BigDecimal("4.7"), 67, 1215, "assets/avatars/doctor-boy.png",
						"Psychiatric evaluation and treatment for anxiety, depression, and stress management.",
						new BigDecimal("115.00"), true, List.of("Psychiatry", "Mental Health", "Stress Management"),
						List.of(
								createWorkingHour("Sun-Thu", "2:00 PM - 8:00 PM"),
								createWorkingHour("Sat", "10:00 AM - 1:00 PM"))),
				createDoctor("Dr. Hala Youssef", "Family Medicine", "hala.youssef@medflow.com", "Hala@2026", 16,
						new BigDecimal("4.8"), 155, 3425, "assets/avatars/doctor-girl.png",
						"Primary care physician for general checkups, chronic disease monitoring, and referrals.",
						new BigDecimal("90.00"), true, List.of("Family Medicine", "Primary Care", "General Checkup"),
						List.of(
								createWorkingHour("Sun-Thu", "8:30 AM - 1:30 PM"),
								createWorkingHour("Fri", "9:00 AM - 12:00 PM"))));
	}

	private PatientSignupRequest createPatient(
			String name,
			String email,
			String password,
			String phone,
			String location,
			Integer age,
			String blood,
			String gender,
			String avatar) {
		PatientSignupRequest request = new PatientSignupRequest();
		request.setName(name);
		request.setEmail(email);
		request.setPassword(password);
		request.setPhone(phone);
		request.setLocation(location);
		request.setAge(age);
		request.setBlood(blood);
		request.setGender(gender);
		request.setAvatar(avatar);
		return request;
	}

	private DoctorSignupRequest createDoctor(
			String name,
			String specialty,
			String email,
			String password,
			Integer experience,
			BigDecimal rating,
			Integer reviews,
			Integer patientsCount,
			String avatar,
			String bio,
			BigDecimal consultationFee,
			boolean isOnline,
			List<String> specialtyTags,
			List<WorkingHourDTO> workingHours) {
		DoctorSignupRequest request = new DoctorSignupRequest();
		request.setName(name);
		request.setSpecialty(specialty);
		request.setEmail(email);
		request.setPassword(password);
		request.setExperience(experience);
		request.setRating(rating);
		request.setReviews(reviews);
		request.setPatientsCount(patientsCount);
		request.setAvatar(avatar);
		request.setBio(bio);
		request.setConsultationFee(consultationFee);
		request.setIsOnline(isOnline);
		request.setSpecialtyTags(specialtyTags);
		request.setWorkingHours(workingHours);
		return request;
	}

	private WorkingHourDTO createWorkingHour(String days, String hours) {
		WorkingHourDTO workingHour = new WorkingHourDTO();
		workingHour.setDays(days);
		workingHour.setHours(hours);
		return workingHour;
	}

	private void seedTimeSlots(TimeSlotRepository timeSlotRepository, DoctorRepository doctorRepository) {
		if (timeSlotRepository.count() > 0) {
			return;
		}

		Doctor julian = requireDoctor(doctorRepository, "julian.sterling@medflow.com");
		Doctor layla = requireDoctor(doctorRepository, "layla.mansour@medflow.com");
		Doctor karim = requireDoctor(doctorRepository, "karim.adel@medflow.com");
		Doctor noor = requireDoctor(doctorRepository, "noor.hassan@medflow.com");
		Doctor omar = requireDoctor(doctorRepository, "omar.fathy@medflow.com");
		Doctor salma = requireDoctor(doctorRepository, "salma.nader@medflow.com");

		timeSlotRepository.saveAll(List.of(
				createTimeSlot(julian, LocalDate.now(), "9:00 AM", true),
				createTimeSlot(julian, LocalDate.now(), "10:00 AM", false),
				createTimeSlot(julian, LocalDate.now().plusDays(1), "11:00 AM", true),
				createTimeSlot(layla, LocalDate.now(), "11:30 AM", false),
				createTimeSlot(layla, LocalDate.now().plusDays(1), "12:30 PM", true),
				createTimeSlot(karim, LocalDate.now().plusDays(1), "1:00 PM", true),
				createTimeSlot(noor, LocalDate.now(), "8:30 AM", true),
				createTimeSlot(omar, LocalDate.now().plusDays(2), "2:00 PM", true),
				createTimeSlot(salma, LocalDate.now().plusDays(1), "9:30 AM", true),
				createTimeSlot(salma, LocalDate.now().plusDays(2), "10:30 AM", false)));
	}

	private CreateAppointmentDTO createAppointment(
			PatientRepository patientRepository,
			DoctorRepository doctorRepository,
			String patientEmail,
			String doctorEmail,
			LocalDate appointmentDate,
			String appointmentTime,
			Integer duration,
			String clinic,
			String icon,
			String iconBg) {
		Patient patient = requirePatient(patientRepository, patientEmail);
		Doctor doctor = requireDoctor(doctorRepository, doctorEmail);

		return CreateAppointmentDTO.builder()
				.patientId(patient.getId())
				.doctorId(doctor.getId())
				.appointmentDate(appointmentDate)
				.appointmentTime(appointmentTime)
				.duration(duration)
				.clinic(clinic)
				.icon(icon)
				.iconBg(iconBg)
				.build();
	}

	private TimeSlot createTimeSlot(Doctor doctor, LocalDate slotDate, String time, boolean available) {
		return TimeSlot.builder()
				.doctor(doctor)
				.slotDate(slotDate)
				.time(time)
				.available(available)
				.build();
	}

	private Patient requirePatient(PatientRepository patientRepository, String email) {
		return patientRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalStateException("Missing patient seed: " + email));
	}

	private Doctor requireDoctor(DoctorRepository doctorRepository, String email) {
		return doctorRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalStateException("Missing doctor seed: " + email));
	}

	private void seedAppointments(
			AppointmentService appointmentService,
			AppointmentRepository appointmentRepository,
			PatientRepository patientRepository,
			DoctorRepository doctorRepository) {
		if (appointmentRepository.count() > 0) {
			return;
		}

		AppointmentDTO booked1 = appointmentService.createAppointment(createAppointment(
				patientRepository, doctorRepository,
				"ahmed.ali@medflow.com", "julian.sterling@medflow.com",
				LocalDate.now(), "10:00 AM", 30,
				"Central Clinic", "fa-stethoscope", "#e8f3ff"));

		AppointmentDTO booked2 = appointmentService.createAppointment(createAppointment(
				patientRepository, doctorRepository,
				"sara.adel@medflow.com", "layla.mansour@medflow.com",
				LocalDate.now(), "11:30 AM", 45,
				"Dermatology Center", "fa-face-smile", "#f3e8ff"));

		AppointmentDTO booked3 = appointmentService.createAppointment(createAppointment(
				patientRepository, doctorRepository,
				"omar.hassan@medflow.com", "hani.saber@medflow.com",
				LocalDate.now(), "1:00 PM", 30,
				"ENT Clinic", "fa-ear-listen", "#eef2ff"));
		appointmentService.completeAppointment(booked3.getId());

		AppointmentDTO booked4 = appointmentService.createAppointment(createAppointment(
				patientRepository, doctorRepository,
				"mona.farid@medflow.com", "salma.nader@medflow.com",
				LocalDate.now().plusDays(1), "9:00 AM", 40,
				"Women Health Clinic", "fa-person-pregnant", "#fff1f2"));

		AppointmentDTO booked5 = appointmentService.createAppointment(createAppointment(
				patientRepository, doctorRepository,
				"youssef.nabil@medflow.com", "dina.farouk@medflow.com",
				LocalDate.now().plusDays(1), "2:00 PM", 30,
				"Endocrine Care", "fa-vial-circle-check", "#ecfeff"));
		appointmentService.cancelAppointment(booked5.getId());

		// ✅ FIXED: laila.hamed@medflow.com now exists in demoPatients()
		appointmentService.createAppointment(createAppointment(
				patientRepository, doctorRepository,
				"laila.hamed@medflow.com", "noor.hassan@medflow.com",
				LocalDate.now().plusDays(2), "12:30 PM", 30,
				"Pediatrics Unit", "fa-baby", "#f0fdf4"));

		appointmentService.createAppointment(createAppointment(
				patientRepository, doctorRepository,
				"salma.ibrahim@medflow.com", "mostafa.rami@medflow.com",
				LocalDate.now().plusDays(3), "4:00 PM", 50,
				"Mental Health Office", "fa-brain", "#fff7ed"));

		appointmentService.createAppointment(createAppointment(
				patientRepository, doctorRepository,
				"khaled.samir@medflow.com", "karim.adel@medflow.com",
				LocalDate.now().minusDays(1), "3:30 PM", 30,
				"Orthopedic Clinic", "fa-bone", "#f8fafc"));
	}
}