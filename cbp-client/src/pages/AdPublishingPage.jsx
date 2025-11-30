import { useState } from 'react';
import { Button } from '../components/common';
import { AdCard } from '../components/ads';
import { mockAdsData } from '../lib/mockData';
import AddLineIcon from 'remixicon-react/AddLineIcon';

/**
 * AdPublishingPage - Ad publishing and management page
 */
const AdPublishingPage = () => {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Draft', 'Scheduled', 'Published'];

  const filteredAds = activeTab === 'All'
    ? mockAdsData
    : mockAdsData.filter((ad) => ad.status === activeTab);

  const handlePreview = (ad) => {
    console.log('Preview ad:', ad);
    alert(`Preview functionality for "${ad.title}" would be implemented here`);
  };

  const handleEdit = (ad) => {
    console.log('Edit ad:', ad);
    alert(`Edit functionality for "${ad.title}" would be implemented here`);
  };

  const handleCreateAd = () => {
    console.log('Create new ad');
    alert('Create ad functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
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
            Ad Publishing
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
            Create and manage advertising campaigns for auctions
          </p>
        </div>
        <Button variant="primary" icon={AddLineIcon} onClick={handleCreateAd}>
          <span className="hidden sm:inline">Create Ad</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>

      {/* Tabs - Exact Figma Design */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            const count = tab === 'All' ? mockAdsData.length : mockAdsData.filter(ad => ad.status === tab).length;
            
            return (
              <div key={tab} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => setActiveTab(tab)}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 6px',
                    height: '32px',
                    borderRadius: '7px',
                    backgroundColor: isActive ? '#F5F5F5' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#FAFAFA';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    fontSize: '16px',
                    lineHeight: '1.4em',
                    letterSpacing: '-0.01em',
                    textAlign: 'center',
                    color: '#1A1A1A'
                  }}>
                    {tab}
                  </span>
                  <div style={{
                    position: 'relative',
                    width: '14px',
                    height: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      position: 'absolute'
                    }}></div>
                    <span style={{
                      fontFamily: 'Inter',
                      fontWeight: 600,
                      fontSize: '9px',
                      lineHeight: '1.4em',
                      letterSpacing: '-0.01em',
                      textAlign: 'center',
                      color: '#1A1A1A',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {count}
                    </span>
                  </div>
                </button>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  gap: '10px',
                  padding: '4px 6px',
                  backgroundColor: isActive ? '#073370' : 'transparent',
                  height: '3px'
                }}></div>
              </div>
            );
          })}
        </div>
        <div style={{
          width: '100%',
          height: '1px',
          backgroundColor: '#E5E5E5'
        }}></div>
      </div>

      {/* Keep old tabs hidden for reference */}
      <div className="hidden">
        <div className="flex gap-3 flex-wrap">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            const count = tab === 'All' ? mockAdsData.length : mockAdsData.filter(ad => ad.status === tab).length;
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="inline-flex items-center gap-2 transition-all rounded-lg"
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 600,
                lineHeight: '20px',
                letterSpacing: '-0.03em',
                backgroundColor: isActive ? '#073370' : 'rgba(245, 245, 245, 1)',
                color: isActive ? 'rgba(255, 255, 255, 1)' : 'rgba(87, 87, 87, 1)',
                border: isActive ? 'none' : '1px solid rgba(229, 229, 229, 1)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(229, 229, 229, 1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(245, 245, 245, 1)';
                }
              }}
            >
              <span>{tab}</span>
              <span 
                className="rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 1)',
                  color: isActive ? 'rgba(255, 255, 255, 1)' : 'rgba(87, 87, 87, 1)',
                  minWidth: '20px',
                  height: '20px',
                  padding: '2px 6px',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredAds.length} ad{filteredAds.length !== 1 ? 's' : ''}
      </div>

      {/* Ad Cards Grid */}
      {filteredAds.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No ads found in this category</p>
          <Button variant="primary" icon={AddLineIcon} onClick={handleCreateAd} className="mt-4">
            Create Your First Ad
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: '16px' }}>
          {filteredAds.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              onPreview={handlePreview}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdPublishingPage;

