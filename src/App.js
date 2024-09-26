import React, { useState, useEffect } from 'react';
import Airtable from 'airtable';
import BookingsTable from './components/BookingsTable';
import BookingsPieChart from './components/BookingsPieChart';
import BookingsBarChart from './components/BookingsBarChart';
import AIAssistant from './components/AIAssistant';
import './styles/App.css';

function App() {
  // State to store fetched records and any error messages
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Log environment variables for debugging
    console.log('All environment variables:', process.env);
    console.log('Base ID:', process.env.REACT_APP_AIRTABLE_BASE_ID);
    console.log('Token:', process.env.REACT_APP_AIRTABLE_PERSONAL_ACCESS_TOKEN);

    // Check if required environment variables are set
    if (!process.env.REACT_APP_AIRTABLE_PERSONAL_ACCESS_TOKEN) {
      setError('Airtable Personal Access Token is not set');
      return;
    }

    if (!process.env.REACT_APP_AIRTABLE_BASE_ID) {
      setError('Airtable Base ID is not set');
      return;
    }

    // Initialize Airtable connection
    const base = new Airtable({
      apiKey: process.env.REACT_APP_AIRTABLE_PERSONAL_ACCESS_TOKEN,
      endpointUrl: 'https://api.airtable.com'
    }).base(process.env.REACT_APP_AIRTABLE_BASE_ID);

    // Fetch records from Airtable
    base('Bookings').select({ maxRecords: 10, view: 'Grid view' })
      .eachPage((records, fetchNextPage) => {
        console.log('Fetched records:', records);
        setRecords(records);
        fetchNextPage();
      }, (err) => {
        if (err) {
          console.error('Error fetching records:', err);
          console.error('Error details:', JSON.stringify(err, null, 2));
          setError(err.message || 'An unknown error occurred');
        }
      });
  }, []);

  // Display error message if there's an error
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>ABC Cleaning Bookings Analytics</h1>
      <AIAssistant records={records} />
      <div className="charts-container">
        <div className="chart">
          <BookingsPieChart records={records} />
        </div>
        <div className="chart">
          <BookingsBarChart records={records} />
        </div>
      </div>
      <BookingsTable records={records} />
    </div>
  );
}

export default App;
