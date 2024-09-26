// Table component for displaying booking details
// Renders a table with Date, Customer, Service, and Final Amount columns
// Uses CSS classes for styling alternate rows


import React from 'react';
import '../styles/BookingsTable.css';

const BookingsTable = ({ bookings }) => {
  if (!bookings || bookings.length === 0) {
    return <div>No booking data available</div>;
  }

  return (
    <div className="bookings-table-container">
      <h2 className="bookings-table-title">Bookings</h2>
      <table className="bookings-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Service</th>
            <th>Final Amount</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={booking.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td>{booking.fields.Date}</td>
              <td>{booking.fields.Name}</td>
              <td>{booking.fields.Service}</td>
              <td>${booking.fields['Final Amount']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;