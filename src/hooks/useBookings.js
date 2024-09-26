import { useState, useEffect } from 'react';
import { fetchBookings } from '../services/api';

const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuarter, setSelectedQuarter] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings();
        setBookings(data);
        setFilteredBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  useEffect(() => {
    if (selectedQuarter) {
      const filtered = bookings.filter(booking => {
        const bookingDate = new Date(booking.fields.Date);
        const bookingQuarter = Math.floor((bookingDate.getMonth() + 3) / 3);
        return `Q${bookingQuarter}` === selectedQuarter;
      });
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  }, [selectedQuarter, bookings]);

  return {
    bookings,
    filteredBookings,
    loading,
    selectedQuarter,
    setSelectedQuarter,
  };
};

export default useBookings;