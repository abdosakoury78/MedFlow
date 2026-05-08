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
  patientName?: string;
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

export interface NotificationItem {
  id: number;
  title: string;
  time: string;
  icon: string;
  read: boolean;
  createdAt: string;
}

export interface AuthResponse<T> {
  message: string;
  user: T;
}

export interface PatientSignupRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
  age?: number;
  blood?: string;
  gender?: string;
  avatar?: string | null;
}

export interface DoctorSignupRequest {
  name: string;
  specialty: string;
  email: string;
  password: string;
  experience?: number;
  rating?: number;
  reviews?: number;
  patientsCount?: number;
  avatar?: string;
  bio?: string;
  consultationFee?: number;
  isOnline?: boolean;
  specialtyTags?: string[];
  workingHours?: WorkingHour[];
}

export interface DoctorProfileUpdateRequest {
  name?: string;
  specialty?: string;
  experience?: number;
  avatar?: string;
  bio?: string;
  consultationFee?: number;
  online?: boolean;
  specialtyTags?: string[];
  workingHours?: WorkingHour[];
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