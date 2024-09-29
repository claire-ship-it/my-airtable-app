import React from 'react';
import './PulsatingButton.css';

export const PulsatingButton = ({
  children,
  className,
  pulseColor = "0, 9, 68", // Darkest color (000944)
  backgroundColor = "147, 220, 245", // Lightest color (93dcf5)
  duration = "2s",
  ...props
}) => {
  return (
    <button
      className={`pulsating-button ${className || ''}`}
      style={{
        '--pulse-color': `rgb(${pulseColor})`,
        '--background-color': `rgb(${backgroundColor})`,
        '--pulse-duration': duration,
      }}
      {...props}
    >
      <span className="button-content">{children}</span>
    </button>
  );
};