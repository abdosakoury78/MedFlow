# MedFlow 🏥

A digital appointment booking platform built for patients and doctors in Egypt — designed to eliminate scheduling friction and bring healthcare access online.

---

## 🧩 The Problem

Booking a doctor in Egypt still means phone calls, long holds, and showing up without confirmation. Doctors manage schedules through paper books, leading to double-bookings and missing patient data. MedFlow solves this.

---

## 👥 Who It's For

**Ahmed Hassan** — Patient, 32, Software Engineer, Cairo

> "I just want to book an appointment fast and not wait on hold for 20 minutes."

**Dr. Karim Nour** — General Practitioner, 45, Alexandria

> "I need to see my full schedule and my patients' info in one place — no chaos."

---

## ✨ Features

**For Patients**

- Sign up and log in securely
- Browse and book available appointment slots
- View and edit personal profile
- Track upcoming and past visits
- Receive instant booking confirmation

**For Doctors**

- Dedicated doctor account and login
- Full schedule view at a glance
- Access patient info before each visit
- Manage and block time slots
- Eliminate double bookings

---

## Development

### Run Backend

- Windows:

```powershell
cd backend
mvnw.cmd spring-boot:run
```

- macOS / Linux:

```bash
cd backend
./mvnw spring-boot:run
```

### Run Frontend

```bash
cd MedFlow
npm install
npm start
```

Or run the Angular dev server directly:

```bash
cd MedFlow
ng serve
```

### Database & Seeding

- The application seeds demo data automatically at startup using `DemoApplication.java`. The seeder uses the application's service layer (e.g., `PatientService`, `DoctorService`) so passwords are encoded and validations run.
- To change the seeded data, edit `backend/src/main/java/com/medical/app/DemoApplication.java`.

### Notes

- Seeder execution order: patients → doctors → time slots → appointments.
- Avatars and static assets are under `MedFlow/src/assets/avatars`.
- If you see JPA lazy-loading issues during startup, the code includes transactional boundaries around appointment writes to avoid those errors.
