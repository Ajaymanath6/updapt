import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { esgMockData } from '../../lib/esgMockData';
import { debounce } from '../../lib/utils';
import SearchLineIcon from 'remixicon-react/SearchLineIcon';
import ArrowDownSLineIcon from 'remixicon-react/ArrowDownSLineIcon';
import CloseLineIcon from 'remixicon-react/CloseLineIcon';
import CheckLineIcon from 'remixicon-react/CheckLineIcon';
import FilterLineIcon from 'remixicon-react/FilterLineIcon';

/**
 * AssignmentFilters - Advanced filters for Review & Audit table
 * User search, Site multi-select, Metric category filter
 */
const AssignmentFilters = ({ onFilterChange }) => {
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedSites, setSelectedSites] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Refs for click outside detection
  const siteDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // Define site groups for quick filtering
  const siteGroups = useMemo(() => [
    { 
      id: 'north-region', 
      label: 'North Region', 
      filter: (site) => site.group === 'North Region' 
    },
    { 
      id: 'south-region', 
      label: 'South Region', 
      filter: (site) => site.group === 'South Region' 
    },
    { 
      id: 'offices', 
      label: 'Office Sites', 
      filter: (site) => site.name.includes('Office') 
    },
    { 
      id: 'warehouses', 
      label: 'Warehouses', 
      filter: (site) => site.name.includes('Warehouse') 
    },
  ], []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (siteDropdownRef.current && !siteDropdownRef.current.contains(event.target)) {
        setIsSiteDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    if (isSiteDropdownOpen || isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSiteDropdownOpen, isCategoryDropdownOpen]);

  // Get unique categories
  const categories = useMemo(() => esgMockData.metricCategories, []);

  // Debounced filter notification
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedNotifyFilterChange = useCallback(
    debounce((filters) => {
      if (onFilterChange) {
        onFilterChange(filters);
      }
    }, 300),
    [onFilterChange]
  );

  // Handle user search
  const handleUserSearch = (term) => {
    setUserSearchTerm(term);
    debouncedNotifyFilterChange({ userSearch: term, sites: selectedSites, categories: selectedCategories });
  };

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
    notifyFilterChange({ userSearch: userSearchTerm, sites: newSelection, categories: selectedCategories });
  };

  // Handle category selection
  const toggleCategory = (category) => {
    const isSelected = selectedCategories.includes(category);
    let newSelection;
    if (isSelected) {
      newSelection = selectedCategories.filter(c => c !== category);
    } else {
      newSelection = [...selectedCategories, category];
    }
    setSelectedCategories(newSelection);
    notifyFilterChange({ userSearch: userSearchTerm, sites: selectedSites, categories: newSelection });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setUserSearchTerm('');
    setSelectedSites([]);
    setSelectedCategories([]);
    notifyFilterChange({ userSearch: '', sites: [], categories: [] });
  };

  // Notify parent of filter changes
  const notifyFilterChange = (filters) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  // Apply site group filter (toggle)
  const applySiteGroup = (group) => {
    const matchingSites = esgMockData.sites.filter(group.filter);
    const allSelected = matchingSites.every(site => selectedSites.some(s => s.id === site.id));
    
    let newSelection;
    if (allSelected) {
      // Remove all sites in this group
      newSelection = selectedSites.filter(site => !matchingSites.some(m => m.id === site.id));
    } else {
      // Add all sites in this group
      newSelection = [...selectedSites];
      matchingSites.forEach(site => {
        if (!newSelection.some(s => s.id === site.id)) {
          newSelection.push(site);
        }
      });
    }
    
    setSelectedSites(newSelection);
    notifyFilterChange({ userSearch: userSearchTerm, sites: newSelection, categories: selectedCategories });
  };

  // Check if a site group is fully selected
  const isSiteGroupSelected = (group) => {
    const matchingSites = esgMockData.sites.filter(group.filter);
    return matchingSites.length > 0 && matchingSites.every(site => selectedSites.some(s => s.id === site.id));
  };

  const hasActiveFilters = userSearchTerm || selectedSites.length > 0 || selectedCategories.length > 0;

  return (
    <div className="space-y-4">
      {/* Filter header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: '8px' }}>
          <FilterLineIcon style={{ width: '20px', height: '20px', color: '#073370' }} />
          <h3 
            style={{
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '24px',
              letterSpacing: '-0.03em',
              color: 'rgba(26, 26, 26, 1)'
            }}
          >
            Filters
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#073370',
              cursor: 'pointer',
              gap: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '4px 8px'
            }}
          >
            <CloseLineIcon style={{ width: '16px', height: '16px' }} />
            Clear all filters
          </button>
        )}
      </div>

      {/* Filter controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* User Search */}
        <div>
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
            Search User
          </label>
          <div className="relative">
            <SearchLineIcon 
              className="absolute left-3 top-1/2 transform -translate-y-1/2" 
              style={{ width: '16px', height: '16px', color: 'rgba(87, 87, 87, 1)' }}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={userSearchTerm}
              onChange={(e) => handleUserSearch(e.target.value)}
              className="w-full focus:outline-none focus:ring-2"
              style={{
                borderRadius: '4px',
                height: '40px',
                paddingLeft: '40px',
                paddingRight: '12px',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                border: '1px solid rgba(229, 229, 229, 1)',
                boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '-0.03em'
              }}
            />
          </div>
        </div>

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
            Filter by Site
          </label>
          
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
                ? `${selectedSites.length} site${selectedSites.length !== 1 ? 's' : ''} selected`
                : 'All Sites'}
            </span>
            <ArrowDownSLineIcon style={{ width: '20px', height: '20px', color: 'rgba(87, 87, 87, 1)' }} />
          </button>

          {isSiteDropdownOpen && (
            <div 
              className="absolute z-10 w-full mt-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 1)',
                border: '1px solid rgba(229, 229, 229, 1)',
                borderRadius: '8px',
                boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.1)',
                maxHeight: '300px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Site group chips */}
              <div style={{ padding: '12px', borderBottom: '1px solid rgba(229, 229, 229, 1)' }}>
                <div 
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    lineHeight: '14px',
                    letterSpacing: '0.02em',
                    color: 'rgba(87, 87, 87, 1)',
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}
                >
                  Quick Filters
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {siteGroups.map(group => {
                    const isSelected = isSiteGroupSelected(group);
                    return (
                      <button
                        key={group.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          applySiteGroup(group);
                        }}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          backgroundColor: isSelected ? '#073370' : 'rgba(7, 51, 112, 0.08)',
                          border: isSelected ? '1px solid #073370' : '1px solid rgba(7, 51, 112, 0.2)',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: isSelected ? '#ffffff' : '#073370',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'rgba(7, 51, 112, 0.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'rgba(7, 51, 112, 0.08)';
                          }
                        }}
                      >
                        {group.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clear button */}
              {selectedSites.length > 0 && (
                <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(229, 229, 229, 1)' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSites([]);
                      notifyFilterChange({ userSearch: userSearchTerm, sites: [], categories: selectedCategories });
                    }}
                    className="flex items-center"
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#073370',
                      cursor: 'pointer',
                      gap: '4px',
                      backgroundColor: 'transparent',
                      border: 'none'
                    }}
                  >
                    <CloseLineIcon style={{ width: '16px', height: '16px' }} />
                    Clear all
                  </button>
                </div>
              )}

              <div style={{ overflowY: 'auto', maxHeight: '180px' }}>
                {esgMockData.sites.map(site => {
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
              </div>
            </div>
          )}
        </div>

        {/* Metric Category Filter */}
        <div className="relative" ref={categoryDropdownRef}>
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
            Filter by Metric Category
          </label>
          
          <button
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
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
              color: selectedCategories.length > 0 ? 'rgba(26, 26, 26, 1)' : 'rgba(87, 87, 87, 1)',
              cursor: 'pointer'
            }}
          >
            <span>
              {selectedCategories.length > 0 
                ? `${selectedCategories.length} categor${selectedCategories.length !== 1 ? 'ies' : 'y'} selected`
                : 'All Categories'}
            </span>
            <ArrowDownSLineIcon style={{ width: '20px', height: '20px', color: 'rgba(87, 87, 87, 1)' }} />
          </button>

          {isCategoryDropdownOpen && (
            <div 
              className="absolute z-10 w-full mt-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 1)',
                border: '1px solid rgba(229, 229, 229, 1)',
                borderRadius: '8px',
                boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.1)',
                maxHeight: '300px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Category chips */}
              <div style={{ padding: '12px' }}>
                <div 
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    lineHeight: '14px',
                    letterSpacing: '0.02em',
                    color: 'rgba(87, 87, 87, 1)',
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}
                >
                  Categories
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {categories.map(category => {
                    const isSelected = selectedCategories.includes(category);
                    return (
                      <button
                        key={category}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(category);
                        }}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          backgroundColor: isSelected ? '#073370' : 'rgba(7, 51, 112, 0.08)',
                          border: isSelected ? '1px solid #073370' : '1px solid rgba(7, 51, 112, 0.2)',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: isSelected ? '#ffffff' : '#073370',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'rgba(7, 51, 112, 0.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'rgba(7, 51, 112, 0.08)';
                          }
                        }}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clear button */}
              {selectedCategories.length > 0 && (
                <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(229, 229, 229, 1)' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategories([]);
                      notifyFilterChange({ userSearch: userSearchTerm, sites: selectedSites, categories: [] });
                    }}
                    className="flex items-center"
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#073370',
                      cursor: 'pointer',
                      gap: '4px',
                      backgroundColor: 'transparent',
                      border: 'none'
                    }}
                  >
                    <CloseLineIcon style={{ width: '16px', height: '16px' }} />
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

AssignmentFilters.propTypes = {
  onFilterChange: PropTypes.func,
};

export default AssignmentFilters;

