const BookingsPieChart = ({ bookings }) => {
  // ... (existing code)

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // ... (other options)
  };

  return (
    <div style={{ width: '100%', height: '100%', maxHeight: '250px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default BookingsPieChart;