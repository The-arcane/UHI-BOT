import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctorId: string) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  return (
    <div className="doctor-card">
      <h3>{doctor.name}</h3>
      <p className="specialty">{doctor.specialty}</p>
      <p>{doctor.hospital}, {doctor.city}</p>
      <div className="rating">⭐ {doctor.rating.toFixed(1)}</div>
      <button 
        onClick={() => onBook(doctor.id)}
        className="book-btn"
      >
        Book Appointment
      </button>
    </div>
  );
};