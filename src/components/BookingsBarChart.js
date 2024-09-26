// Pie chart component for displaying bookings by service
// Uses react-chartjs-2 for rendering
// Processes booking data to count services
// Configures chart options and uses custom color scheme

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BookingsBarChart = ({ bookings }) => {
  if (!bookings || bookings.length === 0) {
    return <div>No booking data available</div>;
  }

  const frequencyCounts = bookings.reduce((acc, booking) => {
    const frequency = booking.fields.Frequency;
    acc[frequency] = (acc[frequency] || 0) + 1;
    return acc;
  }, {});

  const sortedFrequencies = Object.keys(frequencyCounts).sort((a, b) => {
    const order = ['One-time', 'Weekly', 'Bi-weekly', 'Monthly'];
    return order.indexOf(a) - order.indexOf(b);
  });

  const data = {
    labels: sortedFrequencies,
    datasets: [
      {
        label: 'Number of Bookings',
        data: sortedFrequencies.map(freq => frequencyCounts[freq]),
        backgroundColor: '#5c9aca',  // Tertiary color
        borderColor: '#000944',  // Primary color
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,  // This will make the chart square, matching the pie chart
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bookings by Frequency',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Frequency',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Bookings',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>  {/* Adjust this height as needed */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default BookingsBarChart;