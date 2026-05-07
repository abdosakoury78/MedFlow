// =====================
// TYPES / DTO MODELS ONLY — no mock data
// =====================

export interface Doctor {
  id: number;
  name: string;
  email: string;
  specialty: string;
  experience: number;
  rating: number;
  reviews: number;
  patientsCount: number;
  avatar: string;
  bio: string;
  specialties: string[];
  workingHours: WorkingHour[];
  consultationFee: number;
  online: boolean; // Jackson strips "is" prefix → backend "isOnline" becomes "online" in JSON
}

export interface WorkingHour {
  days: string;
  hours: string;
}

export interface Appointment {
  id: number;
  doctorId: number;
  patientId: number;
  doctorName: string;
  specialty: string;
  clinic: string;
  appointmentDate: string;   // LocalDate serialized as "YYYY-MM-DD"
  appointmentTime: string;
  duration: number;
  status: 'COMPLETED' | 'UPCOMING' | 'CANCELLED';
  icon: string;
  iconBg: string;
}

export interface TimeSlot {
  id: number;
  doctorId: number;
  slotDate: string;          // LocalDate → "YYYY-MM-DD"
  time: string;
  available: boolean;
}

export interface Patient {
  id: number;
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

export interface CreateAppointmentPayload {
  doctorId: number;
  patientId: number;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  notes?: string;
}