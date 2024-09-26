import React from 'react';
import '../styles/DateRangePicker.css';

const DateRangePicker = ({ selectedQuarter, onQuarterChange }) => {
  const quarters = [
    { label: 'Q1', value: 'Q1' },
    { label: 'Q2', value: 'Q2' },
    { label: 'Q3', value: 'Q3' },
    { label: 'Q4', value: 'Q4' },
  ];

  return (
    <div className="date-range-picker">
      <label htmlFor="quarter-select">Select Quarter: </label>
      <select
        id="quarter-select"
        value={selectedQuarter}
        onChange={(e) => onQuarterChange(e.target.value)}
      >
        <option value="">All</option>
        {quarters.map((quarter) => (
          <option key={quarter.value} value={quarter.value}>
            {quarter.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateRangePicker;