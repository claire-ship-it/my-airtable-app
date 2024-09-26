// Pie chart component for displaying bookings by service
// Uses react-chartjs-2 for rendering
// Processes booking data to count services
// Configures chart options and uses custom color scheme


import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const BookingsPieChart = ({ bookings }) => {
  if (!bookings || bookings.length === 0) {
    return <div>No booking data available</div>;
  }

  const bookingCounts = bookings.reduce((acc, booking) => {
    const service = booking.fields.Service;
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(bookingCounts),
    datasets: [
      {
        data: Object.values(bookingCounts),
        backgroundColor: [
          '#000944',  // Primary color
          '#93dcf5',  // Secondary color
          '#5c9aca',  // Tertiary color
          '#fffffc',  // Background color
          '#61dafb',  // React logo color
        ],
        borderColor: [
          '#000944',
          '#93dcf5',
          '#5c9aca',
          '#fffffc',
          '#61dafb',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bookings by Service',
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default BookingsPieChart;