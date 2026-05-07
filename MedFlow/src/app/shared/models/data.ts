// =====================
// TYPES
// =====================

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;         // years
  rating: number;
  reviews: number;
  patientsCount: number;
  avatar: string;
  bio: string;
  specialties: string[];
  workingHours: WorkingHour[];
  consultationFee: number;
  isOnline: boolean;
}

export interface WorkingHour {
  days: string;
  hours: string;
}

export interface Appointment {
  id: number;
  doctorId: number;
  doctorName: string;
  specialty: string;
  clinic: string;
  date: string;               // ISO or formatted string
  time: string;
  status: 'COMPLETED' | 'UPCOMING' | 'CANCELLED';
  icon: string;
  iconBg: string;
}

export interface TimeSlot {
  id: number;
  time: string;
  available: boolean;
}

export interface UpcomingAppointment {
  id: number;
  doctorId: number;
  doctorName: string;
  specialty: string;
  time: string;
  avatar: string;
}

export interface TodayAppointment {
  doctor: string;
  specialty: string;
  time: string;
  duration: number;           // minutes
  clinic: string;
  avatar: string;
  status: 'completed' | 'upcoming' | 'cancelled';
}

export interface ScheduledAppointment {
  doctor: string;
  specialty: string;
  date: string;               // e.g. "12 May"
  time: string;
  clinic: string;
  avatar: string;
}

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

export interface SidebarUser {
  name: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DoctorAppointment {
  id: number;
  patientName: string;
  patientAvatar: string;

  appointmentType: string;

  time: string;
  duration: number;

  status: 'completed' | 'upcoming' | 'cancelled';
}

// =====================
// AUTH
// =====================

/** Mock valid login — replace with real backend call later */
export const VALID_CREDENTIALS: LoginCredentials = {
  email: 'admin@test.com',
  password: '123456'
};

// =====================
// PATIENT
// =====================

export const CURRENT_PATIENT: Patient = {
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@gmail.com',
  phone: '+1 (555) 234-8901',
  location: 'Portland, OR',
  age: 28,
  blood: 'O+',
  gender: 'F',
  avatar: '👩'
};

// =====================
// SIDEBAR USER
// =====================

export const SIDEBAR_USER: SidebarUser = {
  name: 'Ahmed',
  role: 'Patient'
};

// =====================
// DOCTORS
// =====================

export const DOCTORS: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Julian Sterling',
    specialty: 'Cardiologist',
    experience: 12,
    rating: 4.9,
    reviews: 120,
    patientsCount: 2400,
    avatar: '👨‍⚕️',
    bio: 'Expert cardiologist specializing in non-invasive heart procedures and preventive care.',
    specialties: ['Cardiology', 'Heart Surgery', 'Diagnostic Imaging', 'Preventive Care'],
    workingHours: [
      { days: 'Mon – Fri', hours: '09:00 AM – 06:00 PM' },
      { days: 'Saturday',  hours: '10:00 AM – 02:00 PM' }
    ],
    consultationFee: 120,
    isOnline: true
  },
  {
    id: 2,
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist',
    experience: 8,
    rating: 4.8,
    reviews: 98,
    patientsCount: 1800,
    avatar: '👩‍⚕️',
    bio: 'Specialist in cardiovascular diagnostics and patient-centered heart care.',
    specialties: ['Cardiology', 'Echocardiography', 'Preventive Care'],
    workingHours: [
      { days: 'Mon – Fri', hours: '08:00 AM – 05:00 PM' }
    ],
    consultationFee: 100,
    isOnline: true
  },
  {
    id: 3,
    name: 'Dr. Michael Chen',
    specialty: 'General Physician',
    experience: 15,
    rating: 4.7,
    reviews: 210,
    patientsCount: 3100,
    avatar: '🧑‍⚕️',
    bio: 'General practitioner focused on holistic and preventive medicine.',
    specialties: ['General Medicine', 'Internal Medicine', 'Preventive Care'],
    workingHours: [
      { days: 'Mon – Sat', hours: '09:00 AM – 07:00 PM' }
    ],
    consultationFee: 80,
    isOnline: false
  },

  // ── Find-Doctor page doctors (previously hardcoded inline) ──────────────────
  {
    id: 4,
    name: 'Dr. Sarah Ahmed',
    specialty: 'Cardiology',
    experience: 10,
    rating: 4.8,
    reviews: 0,
    patientsCount: 0,
    avatar: '🫀',
    bio: '',
    specialties: ['Cardiology'],
    workingHours: [],
    consultationFee: 50,
    isOnline: true
  },
  {
    id: 5,
    name: 'Dr. John Smith',
    specialty: 'Dermatology',
    experience: 8,
    rating: 4.6,
    reviews: 0,
    patientsCount: 0,
    avatar: '🧴',
    bio: '',
    specialties: ['Dermatology'],
    workingHours: [],
    consultationFee: 40,
    isOnline: true
  },
  {
    id: 6,
    name: 'Dr. Emily Brown',
    specialty: 'Neurology',
    experience: 12,
    rating: 4.9,
    reviews: 0,
    patientsCount: 0,
    avatar: '🧠',
    bio: '',
    specialties: ['Neurology'],
    workingHours: [],
    consultationFee: 70,
    isOnline: false
  },
  {
    id: 7,
    name: 'Dr. Ahmed Ali',
    specialty: 'Orthopedics',
    experience: 9,
    rating: 4.7,
    reviews: 0,
    patientsCount: 0,
    avatar: '🦴',
    bio: '',
    specialties: ['Orthopedics'],
    workingHours: [],
    consultationFee: 55,
    isOnline: true
  },
  {
    id: 8,
    name: 'Dr. Lisa Green',
    specialty: 'Pediatrics',
    experience: 7,
    rating: 4.5,
    reviews: 0,
    patientsCount: 0,
    avatar: '👶',
    bio: '',
    specialties: ['Pediatrics'],
    workingHours: [],
    consultationFee: 45,
    isOnline: true
  }
];

// =====================
// SPECIALTIES
// (used by find-doctor filter)
// =====================

export const SPECIALTIES: string[] = [
  'All',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics'
];

// =====================
// TIME SLOTS
// =====================

export const TIME_SLOTS: TimeSlot[] = [
  { id: 1, time: '09:00 AM', available: true  },
  { id: 2, time: '10:30 AM', available: true  },
  { id: 3, time: '11:00 AM', available: true  },
  { id: 4, time: '01:45 PM', available: true  },
  { id: 5, time: '03:00 PM', available: false },
  { id: 6, time: '04:30 PM', available: true  }
];

// =====================
// UPCOMING APPOINTMENTS
// (home dashboard widget)
// =====================

export const UPCOMING_APPOINTMENTS: UpcomingAppointment[] = [
  {
    id: 1,
    doctorId: 2,
    doctorName: 'Dr. Sarah Jenkins',
    specialty: 'Cardiology',
    time: '09:30 AM',
    avatar: '👩‍⚕️'
  },
  {
    id: 2,
    doctorId: 3,
    doctorName: 'Dr. Michael Chen',
    specialty: 'General Health',
    time: '02:15 PM',
    avatar: '🧑‍⚕️'
  }
];

// =====================
// TODAY'S APPOINTMENTS
// (appointments page – today section)
// =====================

export const TODAY_APPOINTMENTS: TodayAppointment[] = [
  {
    doctor: 'Dr. Sarah Ahmed',
    specialty: 'Cardiologist',
    time: '10:30 AM',
    duration: 30,
    clinic: 'Heart Care Center',
    avatar: '❤️',
    status: 'completed'
  },
  {
    doctor: 'Dr. Omar Khaled',
    specialty: 'Dermatologist',
    time: '12:00 PM',
    duration: 20,
    clinic: 'Skin Clinic',
    avatar: '🧑‍⚕️',
    status: 'upcoming'
  }
];

// =====================
// SCHEDULED APPOINTMENTS
// (appointments page – upcoming section)
// =====================

export const SCHEDULED_APPOINTMENTS: ScheduledAppointment[] = [
  {
    doctor: 'Dr. Mona Adel',
    specialty: 'Neurologist',
    date: '12 May',
    time: '3:00 PM',
    clinic: 'Brain Health Center',
    avatar: '🧠'
  },
  {
    doctor: 'Dr. Ahmed Nasser',
    specialty: 'Orthopedic',
    date: '15 May',
    time: '11:00 AM',
    clinic: 'Bone Care Clinic',
    avatar: '🦴'
  }
];

// =====================
// APPOINTMENT HISTORY
// (patient profile page)
// =====================

export const APPOINTMENT_HISTORY: Appointment[] = [
  {
    id: 1,
    doctorId: 1,
    doctorName: 'Dr. Marcus Thorne',
    specialty: 'General Check-up',
    clinic: 'City Medical Center',
    date: '2024-03-12',
    time: '10:00 AM',
    status: 'COMPLETED',
    icon: '🩺',
    iconBg: '#E8F4F8'
  },
  {
    id: 2,
    doctorId: 2,
    doctorName: 'City Dental Care',
    specialty: 'Dental Cleaning',
    clinic: 'City Dental Care',
    date: '2024-01-15',
    time: '02:00 PM',
    status: 'COMPLETED',
    icon: '🦷',
    iconBg: '#FEF0E8'
  }
];

export const DOCTOR_APPOINTMENTS: DoctorAppointment[] = [
  {
    id: 1,
    patientName: 'Sarah Johnson',
    patientAvatar: '👩',
    appointmentType: 'Heart Checkup',
    time: '10:30 AM',
    duration: 30,
    status: 'upcoming'
  },

  {
    id: 2,
    patientName: 'Michael Brown',
    patientAvatar: '👨',
    appointmentType: 'Follow-up Visit',
    time: '12:00 PM',
    duration: 20,
    status: 'completed'
  }
];