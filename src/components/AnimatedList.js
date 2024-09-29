import React, { useEffect, useRef } from 'react';
import '../styles/AnimatedList.css';

const AnimatedList = ({ title, items }) => {
  const listRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.1 }
    );

    const listItems = listRef.current.querySelectorAll('li');
    listItems.forEach((item) => observer.observe(item));

    return () => {
      listItems.forEach((item) => observer.unobserve(item));
    };
  }, [items]);

  return (
    <div className="animated-list">
      <h2>{title}</h2>
      <ul ref={listRef}>
        {items.map((item, index) => (
          <li key={item.id} className="animated-item">
            <div className="item-card">
              <div className="item-content">
                <div className="item-text">
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
                <div className="item-value">{item.value}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnimatedList;