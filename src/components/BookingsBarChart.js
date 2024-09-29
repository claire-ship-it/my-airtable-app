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
        backgroundColor: '#5c9aca',
        borderColor: '#000944',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Bookings by Frequency',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BookingsBarChart;