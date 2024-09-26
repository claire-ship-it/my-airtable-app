import React from 'react';
import '../styles/BookingsTable.css';

function BookingsTable({ records }) {
  // Create a currency formatter
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // Change this to your preferred currency code
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bookings-table-container">
      <h2 className="bookings-table-title">Upcoming Bookings</h2>
      <table className="bookings-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Final Amount</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td>{record.fields.Date || 'No Date'}</td>
              <td>{record.fields.Name || 'No Name'}</td>
              <td>
                {record.fields['Final Amount'] 
                  ? currencyFormatter.format(record.fields['Final Amount']) 
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingsTable;