import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function BookingsPieChart({ records }) {
  // Check if records is undefined or empty
  if (!records || records.length === 0) {
    return <div>Loading data...</div>;
  }

  const serviceData = records.reduce((acc, record) => {
    const service = record.fields.Service || 'Unknown';
    const amount = record.fields['Final Amount'] || 0;
    acc[service] = (acc[service] || 0) + amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(serviceData),
    datasets: [
      {
        data: Object.values(serviceData),
        backgroundColor: [
          '#000944', '#5c9aca', '#93dcf5', '#fffffc', '#4a90e2', '#50e3c2'
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#000944',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Bookings by Service',
        color: '#000944',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: $${value} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  return (
    <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
      <Pie data={data} options={options} />
    </div>
  );
}

export default BookingsPieChart;