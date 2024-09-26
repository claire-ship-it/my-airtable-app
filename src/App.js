// Main application component
// Manages state for bookings and loading
// Fetches booking data on component mount
// Renders the main layout including AIAssistant, charts, and BookingsTable

import React, { useState, useEffect } from 'react';
import './styles/App.css';
import AIAssistant from './components/AIAssistant';
import BookingsTable from './components/BookingsTable';
import BookingsPieChart from './components/BookingsPieChart';
import BookingsBarChart from './components/BookingsBarChart';
import { fetchBookings } from './services/api';

function App() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1>ABC Cleaning Analytics</h1>
        <p className="subtitle">Make Sense of Your Data</p>
        <AIAssistant />
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
            <div className="charts-container">
              <div className="chart">
                <BookingsPieChart bookings={bookings} />
              </div>
              <div className="chart">
                <BookingsBarChart bookings={bookings} />
              </div>
            </div>
            <BookingsTable bookings={bookings} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
