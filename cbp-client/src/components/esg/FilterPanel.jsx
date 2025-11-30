import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { esgMockData } from '../../lib/esgMockData';
import { debounce } from '../../lib/utils';
import SearchLineIcon from 'remixicon-react/SearchLineIcon';
import ArrowDownSLineIcon from 'remixicon-react/ArrowDownSLineIcon';
import CloseLineIcon from 'remixicon-react/CloseLineIcon';
import CheckLineIcon from 'remixicon-react/CheckLineIcon';

/**
 * FilterPanel - Site and Metric multi-select filters with type-ahead search
 */
const FilterPanel = ({ onFilterChange }) => {
  const [selectedSites, setSelectedSites] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [siteSearchTerm, setSiteSearchTerm] = useState('');
  const [metricSearchTerm, setMetricSearchTerm] = useState('');
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [isMetricDropdownOpen, setIsMetricDropdownOpen] = useState(false);

  // Refs for click outside detection
  const siteDropdownRef = useRef(null);
  const metricDropdownRef = useRef(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close site dropdown if clicked outside
      if (siteDropdownRef.current && !siteDropdownRef.current.contains(event.target)) {
        setIsSiteDropdownOpen(false);
      }
      // Close metric dropdown if clicked outside
      if (metricDropdownRef.current && !metricDropdownRef.current.contains(event.target)) {
        setIsMetricDropdownOpen(false);
      }
    };

    // Add event listener when any dropdown is open
    if (isSiteDropdownOpen || isMetricDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSiteDropdownOpen, isMetricDropdownOpen]);

  // Debounced search handlers
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSiteSearch = useCallback(debounce((term) => {
    // Search is handled by filteredSites memo
  }, 300), []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedMetricSearch = useCallback(debounce((term) => {
    // Search is handled by filteredMetrics memo
  }, 300), []);

  // Filter sites based on search term
  const filteredSites = useMemo(() => {
    if (!siteSearchTerm) return esgMockData.sites;
    const term = siteSearchTerm.toLowerCase();
    return esgMockData.sites.filter(site => 
      site.name.toLowerCase().includes(term) || 
      site.group.toLowerCase().includes(term)
    );
  }, [siteSearchTerm]);

  // Filter metrics based on search term
  const filteredMetrics = useMemo(() => {
    if (!metricSearchTerm) return esgMockData.metrics;
    const term = metricSearchTerm.toLowerCase();
    return esgMockData.metrics.filter(metric => 
      metric.name.toLowerCase().includes(term) || 
      metric.category.toLowerCase().includes(term)
    );
  }, [metricSearchTerm]);

  // Group metrics by category
  const groupedMetrics = useMemo(() => {
    const groups = {};
    filteredMetrics.forEach(metric => {
      if (!groups[metric.category]) {
        groups[metric.category] = [];
      }
      groups[metric.category].push(metric);
    });
    return groups;
  }, [filteredMetrics]);

  // Handle site selection
  const toggleSite = (site) => {
    const isSelected = selectedSites.some(s => s.id === site.id);
    let newSelection;
    if (isSelected) {
      newSelection = selectedSites.filter(s => s.id !== site.id);
    } else {
      newSelection = [...selectedSites, site];
    }
    setSelectedSites(newSelection);
    if (onFilterChange) {
      onFilterChange({ sites: newSelection, metrics: selectedMetrics });
    }
  };

  // Handle metric selection
  const toggleMetric = (metric) => {
    const isSelected = selectedMetrics.some(m => m.id === metric.id);
    let newSelection;
    if (isSelected) {
      newSelection = selectedMetrics.filter(m => m.id !== metric.id);
    } else {
      newSelection = [...selectedMetrics, metric];
    }
    setSelectedMetrics(newSelection);
    if (onFilterChange) {
      onFilterChange({ sites: selectedSites, metrics: newSelection });
    }
  };

  // Clear all sites
  const clearSites = () => {
    setSelectedSites([]);
    if (onFilterChange) {
      onFilterChange({ sites: [], metrics: selectedMetrics });
    }
  };

  // Clear all metrics
  const clearMetrics = () => {
    setSelectedMetrics([]);
    if (onFilterChange) {
      onFilterChange({ sites: selectedSites, metrics: [] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Site Filter */}
        <div className="relative" ref={siteDropdownRef}>
          <label 
            style={{
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '20px',
              letterSpacing: '-0.03em',
              color: 'rgba(26, 26, 26, 1)',
              display: 'block',
              marginBottom: '8px'
            }}
          >
            Select Sites
          </label>
          
          {/* Selected count display */}
          <button
            onClick={() => setIsSiteDropdownOpen(!isSiteDropdownOpen)}
            className="w-full flex items-center justify-between"
            style={{
              borderRadius: '4px',
              height: '40px',
              padding: '8px 12px',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              border: '1px solid rgba(229, 229, 229, 1)',
              boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.03em',
              color: selectedSites.length > 0 ? 'rgba(26, 26, 26, 1)' : 'rgba(87, 87, 87, 1)',
              cursor: 'pointer'
            }}
          >
            <span>
              {selectedSites.length > 0 
                ? `${selectedSites.length} of ${esgMockData.sites.length} Sites selected`
                : 'Select Sites...'}
            </span>
            <ArrowDownSLineIcon style={{ width: '20px', height: '20px', color: 'rgba(87, 87, 87, 1)' }} />
          </button>

          {/* Dropdown */}
          {isSiteDropdownOpen && (
            <div 
              className="absolute z-10 w-full mt-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 1)',
                border: '1px solid rgba(229, 229, 229, 1)',
                borderRadius: '8px',
                boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.1)',
                maxHeight: '400px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Search input */}
              <div style={{ padding: '12px', borderBottom: '1px solid rgba(229, 229, 229, 1)' }}>
                <div className="relative">
                  <SearchLineIcon 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2" 
                    style={{ width: '16px', height: '16px', color: 'rgba(87, 87, 87, 1)' }}
                  />
                  <input
                    type="text"
                    placeholder="Search sites..."
                    value={siteSearchTerm}
                    onChange={(e) => setSiteSearchTerm(e.target.value)}
                    className="w-full focus:outline-none"
                    style={{
                      borderRadius: '4px',
                      height: '36px',
                      paddingLeft: '32px',
                      paddingRight: '8px',
                      backgroundColor: 'rgba(249, 249, 249, 1)',
                      border: '1px solid rgba(229, 229, 229, 1)',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.03em'
                    }}
                  />
                </div>
              </div>

              {/* Clear button */}
              {selectedSites.length > 0 && (
                <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(229, 229, 229, 1)' }}>
                  <button
                    onClick={clearSites}
                    className="flex items-center"
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#073370',
                      cursor: 'pointer',
                      gap: '4px'
                    }}
                  >
                    <CloseLineIcon style={{ width: '16px', height: '16px' }} />
                    Clear all
                  </button>
                </div>
              )}

              {/* Site list */}
              <div style={{ overflowY: 'auto', maxHeight: '280px' }}>
                {filteredSites.map(site => {
                  const isSelected = selectedSites.some(s => s.id === site.id);
                  return (
                    <div
                      key={site.id}
                      onClick={() => toggleSite(site)}
                      className="flex items-center cursor-pointer hover:bg-gray-50"
                      style={{
                        padding: '10px 12px',
                        gap: '8px',
                        borderBottom: '1px solid rgba(245, 245, 245, 1)'
                      }}
                    >
                      <div 
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: '2px solid ' + (isSelected ? '#073370' : 'rgba(229, 229, 229, 1)'),
                          backgroundColor: isSelected ? '#073370' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {isSelected && (
                          <CheckLineIcon style={{ width: '12px', height: '12px', color: 'white' }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div 
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: '20px',
                            letterSpacing: '-0.03em',
                            color: 'rgba(26, 26, 26, 1)'
                          }}
                        >
                          {site.name}
                        </div>
                        <div 
                          style={{
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: 'rgba(87, 87, 87, 1)'
                          }}
                        >
                          {site.group}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredSites.length === 0 && (
                  <div 
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: 'rgba(87, 87, 87, 1)',
                      fontSize: '14px'
                    }}
                  >
                    No sites found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Metric Filter */}
        <div className="relative" ref={metricDropdownRef}>
          <label 
            style={{
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '20px',
              letterSpacing: '-0.03em',
              color: 'rgba(26, 26, 26, 1)',
              display: 'block',
              marginBottom: '8px'
            }}
          >
            Select Metrics
          </label>
          
          {/* Selected count display */}
          <button
            onClick={() => setIsMetricDropdownOpen(!isMetricDropdownOpen)}
            className="w-full flex items-center justify-between"
            style={{
              borderRadius: '4px',
              height: '40px',
              padding: '8px 12px',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              border: '1px solid rgba(229, 229, 229, 1)',
              boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.03em',
              color: selectedMetrics.length > 0 ? 'rgba(26, 26, 26, 1)' : 'rgba(87, 87, 87, 1)',
              cursor: 'pointer'
            }}
          >
            <span>
              {selectedMetrics.length > 0 
                ? `${selectedMetrics.length} of ${esgMockData.metrics.length} Metrics selected`
                : 'Select Metrics...'}
            </span>
            <ArrowDownSLineIcon style={{ width: '20px', height: '20px', color: 'rgba(87, 87, 87, 1)' }} />
          </button>

          {/* Dropdown */}
          {isMetricDropdownOpen && (
            <div 
              className="absolute z-10 w-full mt-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 1)',
                border: '1px solid rgba(229, 229, 229, 1)',
                borderRadius: '8px',
                boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.1)',
                maxHeight: '400px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Search input */}
              <div style={{ padding: '12px', borderBottom: '1px solid rgba(229, 229, 229, 1)' }}>
                <div className="relative">
                  <SearchLineIcon 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2" 
                    style={{ width: '16px', height: '16px', color: 'rgba(87, 87, 87, 1)' }}
                  />
                  <input
                    type="text"
                    placeholder="Search metrics..."
                    value={metricSearchTerm}
                    onChange={(e) => setMetricSearchTerm(e.target.value)}
                    className="w-full focus:outline-none"
                    style={{
                      borderRadius: '4px',
                      height: '36px',
                      paddingLeft: '32px',
                      paddingRight: '8px',
                      backgroundColor: 'rgba(249, 249, 249, 1)',
                      border: '1px solid rgba(229, 229, 229, 1)',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.03em'
                    }}
                  />
                </div>
              </div>

              {/* Clear button */}
              {selectedMetrics.length > 0 && (
                <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(229, 229, 229, 1)' }}>
                  <button
                    onClick={clearMetrics}
                    className="flex items-center"
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#073370',
                      cursor: 'pointer',
                      gap: '4px'
                    }}
                  >
                    <CloseLineIcon style={{ width: '16px', height: '16px' }} />
                    Clear all
                  </button>
                </div>
              )}

              {/* Metric list grouped by category */}
              <div style={{ overflowY: 'auto', maxHeight: '280px' }}>
                {Object.entries(groupedMetrics).map(([category, metrics]) => (
                  <div key={category}>
                    {/* Category header */}
                    <div 
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'rgba(245, 245, 245, 1)',
                        fontSize: '12px',
                        fontWeight: 600,
                        lineHeight: '16px',
                        letterSpacing: '-0.02em',
                        color: 'rgba(87, 87, 87, 1)',
                        textTransform: 'uppercase'
                      }}
                    >
                      {category}
                    </div>
                    {/* Metrics in category */}
                    {metrics.map(metric => {
                      const isSelected = selectedMetrics.some(m => m.id === metric.id);
                      return (
                        <div
                          key={metric.id}
                          onClick={() => toggleMetric(metric)}
                          className="flex items-center cursor-pointer hover:bg-gray-50"
                          style={{
                            padding: '10px 12px',
                            gap: '8px',
                            borderBottom: '1px solid rgba(245, 245, 245, 1)'
                          }}
                        >
                          <div 
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              border: '2px solid ' + (isSelected ? '#073370' : 'rgba(229, 229, 229, 1)'),
                              backgroundColor: isSelected ? '#073370' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            {isSelected && (
                              <CheckLineIcon style={{ width: '12px', height: '12px', color: 'white' }} />
                            )}
                          </div>
                          <div 
                            style={{
                              fontSize: '14px',
                              fontWeight: 400,
                              lineHeight: '20px',
                              letterSpacing: '-0.03em',
                              color: 'rgba(26, 26, 26, 1)'
                            }}
                          >
                            {metric.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                {Object.keys(groupedMetrics).length === 0 && (
                  <div 
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: 'rgba(87, 87, 87, 1)',
                      fontSize: '14px'
                    }}
                  >
                    No metrics found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected items summary */}
      {(selectedSites.length > 0 || selectedMetrics.length > 0) && (
        <div 
          className="rounded-lg"
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(7, 51, 112, 0.05)',
            border: '1px solid rgba(7, 51, 112, 0.2)',
            borderRadius: '8px'
          }}
        >
          <div 
            style={{
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '20px',
              letterSpacing: '-0.03em',
              color: '#073370'
            }}
          >
            Selection Summary: {selectedSites.length} Site{selectedSites.length !== 1 ? 's' : ''} × {selectedMetrics.length} Metric{selectedMetrics.length !== 1 ? 's' : ''} = {selectedSites.length * selectedMetrics.length} Combinations
          </div>
        </div>
      )}
    </div>
  );
};

FilterPanel.propTypes = {
  onFilterChange: PropTypes.func,
};

export default FilterPanel;

