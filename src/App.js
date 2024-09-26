import React from 'react';
import './styles/App.css';
import AIAssistant from './components/AIAssistant';
import BookingsTable from './components/BookingsTable';
import BookingsPieChart from './components/BookingsPieChart';
import BookingsBarChart from './components/BookingsBarChart';
import BookingsHeatMap from './components/BookingsHeatMap';
import DateRangePicker from './components/DateRangePicker';
import useBookings from './hooks/useBookings';

function App() {
  const {
    bookings,
    filteredBookings,
    loading,
    selectedQuarter,
    setSelectedQuarter,
  } = useBookings();

  const handleQuarterChange = (quarter) => {
    setSelectedQuarter(quarter);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>ABC Cleaning Analytics</h1>
        <DateRangePicker
          selectedQuarter={selectedQuarter}
          onQuarterChange={handleQuarterChange}
        />
        <AIAssistant records={filteredBookings} />
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
            <div className="charts-container">
              <div className="chart">
                <BookingsPieChart bookings={filteredBookings} />
              </div>
              <div className="chart">
                <BookingsBarChart bookings={filteredBookings} />
              </div>
            </div>
            <div className="heat-map-container">
              <BookingsHeatMap bookings={filteredBookings} />
            </div>
            <div className="table-container">
              <BookingsTable bookings={filteredBookings} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
