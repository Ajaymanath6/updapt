import { useState } from 'react';
import { Button, Pagination } from '../components/common';
import { AuctionTable } from '../components/auctions';
import { mockAuctionsData } from '../lib/mockData';
import AddLineIcon from 'remixicon-react/AddLineIcon';
import SearchLineIcon from 'remixicon-react/SearchLineIcon';
import FunnelSimpleIcon from 'remixicon-react/Filter3LineIcon';

/**
 * AuctionsPage - Auctions listing and management page
 */
const AuctionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filteredAuctions = mockAuctionsData.filter((auction) => {
    const matchesSearch = auction.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedFilters.length === 0 || selectedFilters.includes(auction.status);
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAuctions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAuctions = filteredAuctions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterToggleWithReset = (filter) => {
    handleFilterToggle(filter);
    setCurrentPage(1);
  };

  const handleEdit = (auction) => {
    console.log('Edit auction:', auction);
    alert(`Edit functionality for ${auction.id} would be implemented here`);
  };

  const handleView = (auction) => {
    console.log('View auction:', auction);
    alert(`View details for ${auction.id} would be implemented here`);
  };

  const handleCreateAuction = () => {
    console.log('Create new auction');
    alert('Create auction functionality would be implemented here');
  };

  const handleFilterToggle = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 
            className="font-bold"
            style={{
              fontFamily: 'Inter',
              fontSize: '26px',
              fontWeight: 600,
              lineHeight: '1.2',
              letterSpacing: '-0.04em',
              color: '#001A31'
            }}
          >
            Auctions
          </h1>
          <p 
            className="mt-1"
            style={{
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '1.2',
              letterSpacing: '-0.04em',
              color: '#575757'
            }}
          >
            Manage and monitor all digital asset auctions
          </p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 sm:items-center md:flex-row">
          {/* Search */}
          <div className="relative" style={{ maxWidth: '312px' }}>
            <SearchLineIcon 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" 
              style={{ width: '20px', height: '20px' }}
            />
            <input
              type="text"
              placeholder="Search by auction ID or asset name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full focus:outline-none focus:ring-2 focus:border-transparent"
              style={{
                borderRadius: '4px',
                height: '36px',
                paddingTop: '6px',
                paddingBottom: '6px',
                paddingLeft: '32px',
                paddingRight: '8px',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                border: '1px solid rgba(229, 229, 229, 1)',
                boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '-0.03em',
                fontWeight: 400
              }}
            />
          </div>

          {/* Status Filter Button */}
          <div className="relative">
            <div 
              className="inline-block relative"
              style={showFilterDropdown ? {
                border: '1px solid #073370',
                boxShadow: '0px 0px 0px 2px rgba(7, 51, 112, 0.1)',
                borderRadius: '8px'
              } : {}}
            >
              <Button 
                variant="secondary" 
                icon={FunnelSimpleIcon}
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                Filter
              </Button>
              {/* Filter Badge Counter */}
              {selectedFilters.length > 0 && (
                <span
                  className="absolute -top-2 -right-2 flex items-center justify-center rounded-full"
                  style={{
                    minWidth: '20px',
                    height: '20px',
                    padding: '2px 6px',
                    backgroundColor: '#073370',
                    color: 'rgba(255, 255, 255, 1)',
                    fontSize: '12px',
                    fontWeight: 600,
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {selectedFilters.length}
                </span>
              )}
            </div>
            
            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowFilterDropdown(false)}
                ></div>
                <div 
                  className="absolute left-0 mt-2 bg-white rounded-lg z-20"
                  style={{
                    width: '248px',
                    padding: '6px',
                    border: '1px solid rgba(229, 229, 229, 1)',
                    boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.04), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {/* Heading */}
                  <div 
                    style={{
                      height: '28px',
                      padding: '4px 8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '20px',
                      letterSpacing: '-0.03em',
                      color: 'rgba(87, 87, 87, 1)',
                      textAlign: 'left'
                    }}
                  >
                    Auction status
                  </div>
                  
                      {/* Filter Options */}
                      {[
                        { name: 'Active', color: 'rgba(103, 170, 56, 1)' },
                        { name: 'Processing', color: 'rgba(59, 130, 246, 1)' },
                        { name: 'Cancelled', color: 'rgba(239, 68, 68, 1)' },
                        { name: 'On Hold', color: '#A5A5A5' }
                      ].map((filter) => (
                        <label
                          key={filter.name}
                          className="flex items-center cursor-pointer rounded-lg hover:bg-gray-50"
                          style={{
                            height: '32px',
                            gap: '8px',
                            padding: '4px 6px',
                            backgroundColor: 'rgba(255, 255, 255, 1)'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedFilters.includes(filter.name)}
                            onChange={() => handleFilterToggleWithReset(filter.name)}
                            className="rounded"
                            style={{
                              width: '16.5px',
                              height: '16.5px',
                              cursor: 'pointer',
                              accentColor: '#073370'
                            }}
                          />
                          <div 
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: filter.color,
                              flexShrink: 0
                            }}
                          />
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: 500,
                              lineHeight: '20px',
                              letterSpacing: '-0.03em',
                              color: 'rgba(26, 26, 26, 1)'
                            }}
                          >
                            {filter.name}
                          </span>
                        </label>
                      ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Create Auction Button - Always on right */}
        <div className="w-full md:w-auto">
          <Button variant="primary" icon={AddLineIcon} onClick={handleCreateAuction}>
            Create Auction
          </Button>
        </div>
      </div>

      {/* Auctions Table */}
      <AuctionTable
        auctions={paginatedAuctions}
        onEdit={handleEdit}
        onView={handleView}
      />

      {/* Pagination - Figma Design */}
      {totalPages > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAuctions.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AuctionsPage;

