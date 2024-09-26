import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BookingsBarChart({ records }) {
  const frequencyData = records.reduce((acc, record) => {
    const frequency = record.fields.Frequency || 'Unknown';
    const amount = record.fields['Final Amount'] || 0;
    acc[frequency] = (acc[frequency] || 0) + amount;
    return acc;
  }, {});

  // Process the records data here
  // This is just an example, adjust according to your actual data structure
  const data = {
    labels: Object.keys(frequencyData),
    datasets: [
      {
        label: 'Bookings',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bookings by Frequency'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Amount ($)'
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default BookingsBarChart;