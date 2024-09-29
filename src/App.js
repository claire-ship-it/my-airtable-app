// Main application component
// Manages state for bookings and loading
// Fetches booking data on component mount
// Renders the main layout including AIAssistant, charts, and animated lists

import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';
import './styles/App.css';
import AIAssistant from './components/AIAssistant';
import BookingsPieChart from './components/BookingsPieChart';
import BookingsBarChart from './components/BookingsBarChart';
import AnimatedList from './components/AnimatedList';
import { fetchBookings } from './services/api';
import './ui/PulsatingButton.css';
import TimeframeSelector from './components/TimeframeSelector';
import { TypingAnimation } from './components/TypingAnimation';

function App() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessMetrics, setBusinessMetrics] = useState({
    revenue: 0,
    profit: 0,
    grossMargin: 0,
    totalRating: 0
  });
  const [progressMetrics, setProgressMetrics] = useState({
    recurringCustomers: 0,
    totalBookings: 0,
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [headerAnimationComplete, setHeaderAnimationComplete] = useState(false);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings();
        console.log('Fetched bookings:', data); // Debug log

        // Validate and process the fetched data
        if (Array.isArray(data) && data.length > 0) {
          console.log('Sample booking:', data[0]); // Debug log

          // Filter out invalid bookings
          const validBookings = data.filter(booking => {
            if (!booking || !booking.fields) {
              console.log('Invalid booking (no fields):', booking);
              return false;
            }
            const fields = booking.fields;
            const requiredFields = ['Service', 'Frequency', 'Final Amount', 'Sales Tax', 'Provider Payment', 'Rating'];
            const missingFields = requiredFields.filter(field => fields[field] === undefined);
            if (missingFields.length > 0) {
              console.log('Booking missing fields:', missingFields, booking);
              return false;
            }
            return true;
          });

          console.log('Valid bookings:', validBookings); // Debug log

          if (validBookings.length === 0) {
            console.error('No valid bookings found after filtering');
          }

          setBookings(validBookings);
          setFilteredBookings(validBookings);
          calculateBusinessMetrics(validBookings);
          calculateProgressMetrics(validBookings);
        } else {
          console.error('Fetched data is not in the expected format:', data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const calculateBusinessMetrics = (bookingsData) => {
    console.log('Calculating metrics for:', bookingsData); // Debug log
    let totalRevenue = 0;
    let totalProfit = 0;
    let totalRating = 0;
    let ratingCount = 0;

    bookingsData.forEach(booking => {
      const finalAmount = parseFloat(booking.fields['Final Amount'] || 0);
      const salesTax = parseFloat(booking.fields['Sales Tax'] || 0);
      const revenue = finalAmount - salesTax;
      const providerPayment = parseFloat(booking.fields['Provider Payment'] || 0);
      const rating = parseFloat(booking.fields['Rating'] || 0);

      console.log('Booking:', { 
        finalAmount, 
        salesTax, 
        revenue, 
        providerPayment, 
        rating,
        date: booking.fields['Date'] // Add this to check the date
      }); // Debug log

      totalRevenue += revenue;
      totalProfit += revenue - providerPayment;
      
      if (rating > 0) {
        totalRating += rating;
        ratingCount++;
      }
    });

    const grossMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

    console.log('Calculated metrics:', { 
      totalRevenue, 
      totalProfit, 
      grossMargin, 
      averageRating,
      bookingsCount: bookingsData.length 
    }); // Debug log

    setBusinessMetrics({
      revenue: totalRevenue.toFixed(2),
      profit: totalProfit.toFixed(2),
      grossMargin: grossMargin.toFixed(2),
      totalRating: averageRating.toFixed(1)
    });
  };

  const calculateProgressMetrics = (bookingsData) => {
    const totalBookings = bookingsData.length;
    const recurringCustomers = bookingsData.filter(booking => booking.fields.Frequency !== 'One-Time').length;
    
    setProgressMetrics({
      recurringCustomers: recurringCustomers,
      totalBookings: totalBookings,
    });
  };

  const filterBookingsByTimeframe = (bookings, type, value) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    return bookings.filter(booking => {
      const bookingDate = new Date(booking.fields.Date);
      const bookingYear = bookingDate.getFullYear();
      const bookingMonth = bookingDate.getMonth();

      switch (type) {
        case 'month':
          return bookingMonth === parseInt(value) - 1 && bookingYear === currentYear;
        case 'quarter':
          const quarter = Math.floor(bookingMonth / 3) + 1;
          return quarter === parseInt(value) && bookingYear === currentYear;
        case 'year':
          return bookingYear === parseInt(value);
        default:
          return true;
      }
    });
  };

  const handleTimeframeSelect = (type, value) => {
    setSelectedTimeframe({ type, value });
    const filtered = filterBookingsByTimeframe(bookings, type, value);
    setFilteredBookings(filtered);
    calculateBusinessMetrics(filtered);
    calculateProgressMetrics(filtered);
  };

  const handleHeaderAnimationComplete = () => {
    setHeaderAnimationComplete(true);
    setShowWelcome(true);
  };

  return (
    <div className="App">
      <div className="grid-background">
        <svg className="grid-pattern" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="container">
        <h1>ABC Cleaning Analytics</h1>
        <div className="header-container">
          <p className="welcome-message">
            <TypingAnimation text="Welcome Back, John!" typingSpeed={100} />
          </p>
          <TimeframeSelector 
            onSelect={handleTimeframeSelect} 
            selectedTimeframe={selectedTimeframe}
          />
        </div>
        <div className="content-wrapper">
          <div className="magic-cards-container">
            <div className="magic-card">
              <h3>Revenue</h3>
              <p>${businessMetrics.revenue}</p>
            </div>
            <div className="magic-card">
              <h3>Profit</h3>
              <p>${businessMetrics.profit}</p>
            </div>
            <div className="magic-card">
              <h3>Gross Margin</h3>
              <p>{businessMetrics.grossMargin}%</p>
            </div>
            <div className="magic-card">
              <h3>Total Rating</h3>
              <p>{businessMetrics.totalRating}/5</p>
            </div>
          </div>
          <div className="data-visualization-container">
            <div className="progress-bars-container">
              <div className="progress-item">
                <div className="progress-circle">
                  <Progress
                    type="circle"
                    percent={(progressMetrics.recurringCustomers / 15) * 100}
                    format={() => `${progressMetrics.recurringCustomers}/15`}
                    strokeColor={{
                      '0%': '#000944',
                      '100%': '#93dcf5',
                    }}
                  />
                </div>
                <div className="progress-title">
                  <h3>Recurring</h3>
                  <h3>Customers</h3>
                </div>
              </div>
              <div className="progress-item">
                <div className="progress-circle">
                  <Progress
                    type="circle"
                    percent={(progressMetrics.totalBookings / 50) * 100}
                    format={() => `${progressMetrics.totalBookings}/50`}
                    strokeColor={{
                      '0%': '#5c9aca',
                      '100%': '#fffffc',
                    }}
                  />
                </div>
                <div className="progress-title">
                  <h3>Total</h3>
                  <h3>Bookings</h3>
                </div>
              </div>
            </div>
            <div className="ai-assistant-container">
              <AIAssistant 
                businessData={{
                  revenue: businessMetrics.revenue,
                  profit: businessMetrics.profit,
                  grossMargin: businessMetrics.grossMargin,
                  totalRating: businessMetrics.totalRating,
                  recurringCustomers: progressMetrics.recurringCustomers,
                  totalBookings: progressMetrics.totalBookings
                }}
                allBookings={filteredBookings} // Pass all bookings to AIAssistant
              />
            </div>
          </div>
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              <div className="charts-container">
                <div className="chart-item">
                  <h3>Bookings by Service Type</h3>
                  <div className="chart-container">
                    {filteredBookings.length > 0 ? (
                      <BookingsPieChart bookings={filteredBookings} />
                    ) : (
                      <p>No valid data available for Pie Chart</p>
                    )}
                  </div>
                </div>
                <div className="chart-item">
                  <h3>Bookings by Frequency</h3>
                  <div className="chart-container">
                    {filteredBookings.length > 0 ? (
                      <BookingsBarChart bookings={filteredBookings} />
                    ) : (
                      <p>No valid data available for Bar Chart</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="lists-container">
                <AnimatedList
                  title="Recent Bookings"
                  items={filteredBookings.slice(0, 5).map(booking => ({
                    id: booking.id,
                    title: booking.fields.Service,
                    subtitle: `${booking.fields.Date} - ${booking.fields.Name}`,
                    value: `$${Math.round(parseFloat(booking.fields['Final Amount'] || 0) - parseFloat(booking.fields['Sales Tax'] || 0))}`
                  }))}
                />
                <AnimatedList
                  title="Recent Reviews"
                  items={filteredBookings.filter(booking => booking.fields['Rating comment'])
                    .slice(0, 5)
                    .map(booking => ({
                      id: booking.id,
                      title: booking.fields.Name,
                      subtitle: booking.fields['Rating comment'],
                      value: `${booking.fields.Rating}/5`
                    }))}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;