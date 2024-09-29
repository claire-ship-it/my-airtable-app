import React from 'react';
import { Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
const years = ['2023', '2024', '2025']; // Add more years as needed

const TimeframeSelector = ({ onSelect, selectedTimeframe }) => {
  const handleMenuClick = (e) => {
    const [type, value] = e.key.split('-');
    onSelect(type, value);
  };

  const getDisplayText = () => {
    if (!selectedTimeframe) return 'Select Timeframe';
    const { type, value } = selectedTimeframe;
    switch (type) {
      case 'month':
        return `${months[parseInt(value) - 1]} ${new Date().getFullYear()}`;
      case 'quarter':
        return `${quarters[parseInt(value) - 1]} ${new Date().getFullYear()}`;
      case 'year':
        return value;
      default:
        return 'Select Timeframe';
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.SubMenu key="month" title="Month">
        {months.map((month, index) => (
          <Menu.Item key={`month-${index + 1}`}>{month}</Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu key="quarter" title="Quarter">
        {quarters.map((quarter, index) => (
          <Menu.Item key={`quarter-${index + 1}`}>{quarter}</Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu key="year" title="Year">
        {years.map((year) => (
          <Menu.Item key={`year-${year}`}>{year}</Menu.Item>
        ))}
      </Menu.SubMenu>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
        {getDisplayText()} <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default TimeframeSelector;