import React, { useState, useEffect } from 'react';

export const TypingAnimation = ({ text, className, typingSpeed = 100, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    console.log('Starting animation for text:', text);
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        const newChar = text.charAt(index);
        console.log('Adding character:', newChar);
        setDisplayText((prev) => {
          const newText = prev + newChar;
          console.log('New display text:', newText);
          return newText;
        });
        index++;
      } else {
        console.log('Animation complete');
        clearInterval(timer);
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    }, typingSpeed);

    return () => {
      console.log('Cleaning up animation');
      clearInterval(timer);
    };
  }, [text, typingSpeed, onComplete]);

  return (
    <span className={`typing-animation ${className}`}>
      {displayText}
      {!isComplete && <span className="cursor">|</span>}
    </span>
  );
};