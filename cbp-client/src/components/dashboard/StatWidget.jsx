import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from '../common';

/**
 * StatWidget - KPI card for displaying statistics with an icon
 * @param {Object} props
 * @param {string} props.title - The title/label of the stat
 * @param {string|number} props.value - The stat value to display
 * @param {React.ComponentType} props.icon - Remix Icon component
 */
const StatWidget = ({ 
  title, 
  value, 
  // eslint-disable-next-line no-unused-vars
  icon: Icon, 
  valueByPeriod = {}
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  
  // Get value based on selected period
  const getValueForPeriod = () => {
    if (valueByPeriod[selectedPeriod]) {
      return valueByPeriod[selectedPeriod];
    }
    return value;
  };

  // Get date range based on period
  const getDateRange = () => {
    switch (selectedPeriod) {
      case 'D':
        return 'Today, Nov 2';
      case 'Week':
        return '19 Monday - 26 Sunday';
      case 'M':
        return 'Oct 1 - Oct 31';
      default:
        return '19 Monday - 26 Sunday';
    }
  };
  
  return (
    <div 
      className="bg-white rounded-lg border overflow-hidden w-full"
      style={{
        minWidth: '280px',
        height: '131px',
        gap: '16px',
        borderRadius: '12px',
        borderWidth: '1px',
        padding: '8px',
        borderColor: 'rgba(229, 229, 229, 1)',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Top Row: Icon/Title and Tabs */}
      <div className="flex items-start justify-between mb-2">
        {/* Icon and Title */}
        <div className="flex items-center" style={{ gap: '4px' }}>
          <div 
            className="p-1 rounded-lg"
            style={{
              backgroundColor: 'transparent',
              color: '#073370'
            }}
          >
            <Icon style={{ width: '20px', height: '20px' }} />
          </div>
          <p 
            style={{
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '20px',
              letterSpacing: '-0.03em',
              color: 'rgba(87, 87, 87, 1)'
            }}
          >
            {title}
          </p>
        </div>

        {/* Period Tabs */}
        <div 
          className="flex"
          style={{
            height: '36px',
            borderRadius: '8px',
            padding: '4px',
            backgroundColor: 'rgba(245, 245, 245, 1)'
          }}
        >
          {['D', 'Week', 'M'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className="transition-colors"
              style={{
                minWidth: '48px',
                height: '28px',
                gap: '4px',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '20px',
                letterSpacing: '-0.03em',
                textAlign: 'center',
                ...(selectedPeriod === period ? {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  border: '1px solid rgba(229, 229, 229, 1)',
                  boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                  color: 'rgba(26, 26, 26, 1)'
                } : {
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'rgba(87, 87, 87, 1)'
                })
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Count */}
      <div 
        style={{
          fontSize: '32px',
          fontWeight: 700,
          lineHeight: '110%',
          letterSpacing: '-0.03em',
          color: 'rgba(26, 26, 26, 1)',
          marginBottom: '4px'
        }}
      >
        {getValueForPeriod()}
      </div>

      {/* Date Range */}
      <div 
        style={{
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '20px',
          letterSpacing: '-0.03em',
          textAlign: 'left',
          color: 'rgba(87, 87, 87, 1)'
        }}
      >
        {getDateRange()}
      </div>
    </div>
  );
};

StatWidget.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  valueByPeriod: PropTypes.shape({
    D: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Week: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    M: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

export default StatWidget;

