import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BookingsBarChart = ({ bookings }) => {
  if (!bookings || bookings.length === 0) {
    console.log('No bookings data available');
    return <div>No booking data available</div>;
  }

  console.log('Bookings data:', bookings);

  const allFrequencies = ['One-Time', 'Weekly', 'Bi-weekly', 'Monthly'];
  
  const frequencyCounts = allFrequencies.reduce((acc, freq) => {
    acc[freq] = 0;
    return acc;
  }, {});

  const frequencyMapping = {
    'One-Time': 'One-Time',
    'Weekly': 'Weekly',
    'Every Other Week': 'Bi-weekly',
    'Monthly': 'Monthly'
  };

  bookings.forEach(booking => {
    const rawFrequency = booking.fields.Frequency;
    console.log('Raw booking frequency:', rawFrequency);
    const mappedFrequency = frequencyMapping[rawFrequency] || rawFrequency;
    if (allFrequencies.includes(mappedFrequency)) {
      frequencyCounts[mappedFrequency]++;
    } else {
      console.log('Unexpected frequency:', rawFrequency);
    }
  });

  console.log('Frequency counts:', frequencyCounts);

  // Filter out frequencies with zero bookings
  const activeFrequencies = allFrequencies.filter(freq => frequencyCounts[freq] > 0);

  const data = {
    labels: activeFrequencies,
    datasets: [
      {
        label: 'Number of Bookings',
        data: activeFrequencies.map(freq => frequencyCounts[freq]),
        backgroundColor: '#5c9aca',
        borderColor: '#000944',
        borderWidth: 1,
      },
    ],
  };

  console.log('Chart data:', data);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          stepSize: 1,
          precision: 0,
          font: {
            size: 10
          }
        },
        suggestedMax: Math.max(...Object.values(frequencyCounts)) + 1,
      },
      x: {
        ticks: { 
          autoSkip: false, 
          maxRotation: 0, 
          minRotation: 0,
          font: {
            size: 10
          }
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '280px' }}> {/* Adjusted minHeight */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default BookingsBarChart;