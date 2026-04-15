export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviews: number;
  patients: string;
  avatar: string;
  bio: string;
  specialties: string[];
  workingHours: { days: string; hours: string }[];
  consultationFee: number;
  isOnline: boolean;
}

export interface Appointment {
  id: number;
  doctorName: string;
  specialty: string;
  clinic: string;
  date: string;
  time: string;
  status: 'COMPLETED' | 'UPCOMING' | 'CANCELLED';
  icon: string;
  iconBg: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export const DOCTORS: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Julian Sterling',
    specialty: 'Senior Cardiologist & Specialist',
    experience: 12,
    rating: 4.9,
    reviews: 120,
    patients: '2.4k',
    avatar: '👨‍⚕️',
    bio: 'Dr. Julian Sterling is a board-certified cardiologist with over 12 years of experience in cardiovascular medicine. He specializes in non-invasive procedures and lifestyle-focused heart health. His patient-centric approach focuses on preventative care and tailored treatment plans for a sanctuary-like recovery.',
    specialties: ['Cardiology', 'Heart Surgery', 'Diagnostic Imaging', 'Preventative Care'],
    workingHours: [
      { days: 'Mon – Fri', hours: '09:00 AM – 06:00 PM' },
      { days: 'Saturday', hours: '10:00 AM – 02:00 PM' }
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
    patients: '1.8k',
    avatar: '👩‍⚕️',
    bio: 'Dr. Sarah Jenkins is a dedicated cardiologist known for her compassionate patient care and expertise in cardiovascular diagnostics.',
    specialties: ['Cardiology', 'Echocardiography', 'Preventative Care'],
    workingHours: [
      { days: 'Mon – Fri', hours: '08:00 AM – 05:00 PM' }
    ],
    consultationFee: 100,
    isOnline: true
  },
  {
    id: 3,
    name: 'Dr. Michael Chen',
    specialty: 'General Health',
    experience: 15,
    rating: 4.7,
    reviews: 210,
    patients: '3.1k',
    avatar: '🧑‍⚕️',
    bio: 'Dr. Michael Chen provides comprehensive general health services with a focus on preventative medicine and holistic wellness.',
    specialties: ['General Health', 'Internal Medicine', 'Preventative Care'],
    workingHours: [
      { days: 'Mon – Sat', hours: '09:00 AM – 07:00 PM' }
    ],
    consultationFee: 80,
    isOnline: false
  }
];

export const APPOINTMENT_HISTORY: Appointment[] = [
  {
    id: 1,
    doctorName: 'Dr. Marcus Thorne',
    specialty: 'General Check-up',
    clinic: 'City Medical Center',
    date: 'Mar 12, 2024',
    time: '10:00 AM',
    status: 'COMPLETED',
    icon: '🩺',
    iconBg: '#E8F4F8'
  },
  {
    id: 2,
    doctorName: 'City Dental Care',
    specialty: 'Dental Cleaning',
    clinic: 'City Dental Care',
    date: 'Jan 15, 2024',
    time: '02:00 PM',
    status: 'COMPLETED',
    icon: '🦷',
    iconBg: '#FEF0E8'
  },
  {
    id: 3,
    doctorName: 'Heart & Wellness Clinic',
    specialty: 'Cardiology Screen',
    clinic: 'Heart & Wellness Clinic',
    date: 'Nov 22, 2023',
    time: '11:30 AM',
    status: 'COMPLETED',
    icon: '❤️',
    iconBg: '#FEE8E8'
  }
];

export const TIME_SLOTS: TimeSlot[] = [
  { time: '09:00 AM', available: true },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '01:45 PM', available: true },
  { time: '03:00 PM', available: false },
  { time: '04:30 PM', available: true }
];