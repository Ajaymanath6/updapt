import { useState } from 'react';
import PropTypes from 'prop-types';
import { StatusTag } from '../common';
import CheckLineIcon from 'remixicon-react/CheckLineIcon';
import CloseLineIcon from 'remixicon-react/CloseLineIcon';
import PencilLineIcon from 'remixicon-react/PencilLineIcon';
import EyeLineIcon from 'remixicon-react/EyeLineIcon';
import EditLineIcon from 'remixicon-react/EditLineIcon';
import ArrowUpSLineIcon from 'remixicon-react/ArrowUpSLineIcon';
import ArrowDownSLineIcon from 'remixicon-react/ArrowDownSLineIcon';

/**
 * AuctionTable - Data table for displaying auctions
 * @param {Object} props
 * @param {Array} props.auctions - Array of auction objects
 * @param {Function} props.onEdit - Edit action handler
 * @param {Function} props.onView - View details action handler
 */
const AuctionTable = ({ auctions, onEdit, onView }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedAuctions, setSelectedAuctions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggleMenu = (auctionId) => {
    setOpenMenuId(openMenuId === auctionId ? null : auctionId);
  };
  
  const handleViewAction = (auction) => {
    setOpenMenuId(null);
    if (onView) onView(auction);
  };

  const handleEditAction = (auction) => {
    setOpenMenuId(null);
    if (onEdit) onEdit(auction);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAuctions([]);
    } else {
      setSelectedAuctions(auctions.map(a => a.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectAuction = (auctionId) => {
    if (selectedAuctions.includes(auctionId)) {
      setSelectedAuctions(selectedAuctions.filter(id => id !== auctionId));
    } else {
      setSelectedAuctions([...selectedAuctions, auctionId]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
            <tr>
              {/* Checkbox Column Header */}
                  <th 
                    className="text-left"
                    style={{
                      width: '32px',
                      height: '40px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      paddingLeft: '8px',
                      borderBottom: '1px solid rgba(229, 229, 229, 1)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded"
                      style={{
                        width: '16.5px',
                        height: '16.5px',
                        cursor: 'pointer',
                        accentColor: '#073370'
                      }}
                    />
                  </th>
              <th 
                className="text-left"
                style={{
                  paddingTop: '8px',
                  paddingRight: '16px',
                  paddingBottom: '8px',
                  paddingLeft: '16px',
                  borderBottom: '1px solid rgba(229, 229, 229, 1)',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(87, 87, 87, 1)'
                }}
              >
                <div className="flex items-center gap-1">
                  Auction ID
                  <div className="flex flex-col">
                    <ArrowUpSLineIcon style={{ width: '12px', height: '12px', color: 'rgba(87, 87, 87, 1)' }} />
                    <ArrowDownSLineIcon style={{ width: '12px', height: '12px', color: 'rgba(87, 87, 87, 1)', marginTop: '-6px' }} />
                  </div>
                </div>
              </th>
              <th 
                className="text-left"
                style={{
                  paddingTop: '8px',
                  paddingRight: '16px',
                  paddingBottom: '8px',
                  paddingLeft: '16px',
                  borderBottom: '1px solid rgba(229, 229, 229, 1)',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(87, 87, 87, 1)'
                }}
              >
                <div className="flex items-center gap-1">
                  Asset Name
                  <div className="flex flex-col">
                    <ArrowUpSLineIcon style={{ width: '12px', height: '12px', color: 'rgba(87, 87, 87, 1)' }} />
                    <ArrowDownSLineIcon style={{ width: '12px', height: '12px', color: 'rgba(87, 87, 87, 1)', marginTop: '-6px' }} />
                  </div>
                </div>
              </th>
              <th 
                className="text-left"
                style={{
                  paddingTop: '8px',
                  paddingRight: '16px',
                  paddingBottom: '8px',
                  paddingLeft: '16px',
                  borderBottom: '1px solid rgba(229, 229, 229, 1)',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(87, 87, 87, 1)'
                }}
              >
                <div className="flex items-center gap-1">
                  Status
                  <div className="flex flex-col">
                    <ArrowUpSLineIcon style={{ width: '12px', height: '12px', color: 'rgba(87, 87, 87, 1)' }} />
                    <ArrowDownSLineIcon style={{ width: '12px', height: '12px', color: 'rgba(87, 87, 87, 1)', marginTop: '-6px' }} />
                  </div>
                </div>
              </th>
              <th 
                className="text-left"
                style={{
                  paddingTop: '8px',
                  paddingRight: '16px',
                  paddingBottom: '8px',
                  paddingLeft: '16px',
                  borderBottom: '1px solid rgba(229, 229, 229, 1)',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(87, 87, 87, 1)'
                }}
              >
                <div className="flex items-center gap-1">
                  Start Date
                  <div className="flex flex-col">
                    <ArrowUpSLineIcon style={{ width: '12px', height: '12px', color: 'rgba(87, 87, 87, 1)' }} />
                    <ArrowDownSLineIcon style={{ width: '12px', height: '12px', color: 'rgba(87, 87, 87, 1)', marginTop: '-6px' }} />
                  </div>
                </div>
              </th>
              <th 
                className="text-left"
                style={{
                  paddingTop: '8px',
                  paddingRight: '16px',
                  paddingBottom: '8px',
                  paddingLeft: '16px',
                  borderBottom: '1px solid rgba(229, 229, 229, 1)',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(87, 87, 87, 1)'
                }}
              >
                <div className="flex items-center gap-1">
                  End Date
                  <div className="flex flex-col">
                    <ArrowUpSLineIcon style={{ width: '12px', height: '12px', color: 'rgba(87, 87, 87, 1)' }} />
                    <ArrowDownSLineIcon style={{ width: '12px', height: '12px', color: 'rgba(87, 87, 87, 1)', marginTop: '-6px' }} />
                  </div>
                </div>
              </th>
              <th 
                className="text-left"
                style={{
                  paddingTop: '8px',
                  paddingRight: '16px',
                  paddingBottom: '8px',
                  paddingLeft: '16px',
                  borderBottom: '1px solid rgba(229, 229, 229, 1)',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(87, 87, 87, 1)'
                }}
              >
                <div className="flex items-center gap-1">
                  Notice
                  <div className="flex flex-col">
                    <ArrowUpSLineIcon style={{ width: '12px', height: '12px', color: 'rgba(87, 87, 87, 1)' }} />
                    <ArrowDownSLineIcon style={{ width: '12px', height: '12px', color: 'rgba(87, 87, 87, 1)', marginTop: '-6px' }} />
                  </div>
                </div>
              </th>
              <th 
                className="text-center"
                style={{
                  width: '73px',
                  paddingTop: '8px',
                  paddingRight: '16px',
                  paddingBottom: '8px',
                  paddingLeft: '16px',
                  borderBottom: '1px solid rgba(229, 229, 229, 1)',
                  borderLeft: '1px solid rgba(229, 229, 229, 1)',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(87, 87, 87, 1)'
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auctions.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                  No auctions found
                </td>
              </tr>
            ) : (
              auctions.map((auction) => (
                <tr key={auction.id} className="hover:bg-gray-50 transition-colors">
                  {/* Checkbox Column */}
                  <td 
                    style={{
                      width: '32px',
                      height: '56px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      paddingLeft: '8px',
                      borderBottom: '1px solid rgba(229, 229, 229, 1)',
                      backgroundColor: 'rgba(255, 255, 255, 1)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAuctions.includes(auction.id)}
                      onChange={() => handleSelectAuction(auction.id)}
                      className="rounded"
                      style={{
                        width: '16.5px',
                        height: '16.5px',
                        cursor: 'pointer',
                        accentColor: '#073370'
                      }}
                    />
                  </td>
                  <td 
                    style={{
                      padding: '16px',
                      borderBottom: '1px solid rgba(229, 229, 229, 1)',
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '20px',
                      letterSpacing: '-0.03em',
                      color: 'rgba(26, 26, 26, 1)'
                    }}
                  >
                    {auction.id}
                  </td>
                  <td 
                    style={{
                      padding: '16px',
                      borderBottom: '1px solid rgba(229, 229, 229, 1)',
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '20px',
                      letterSpacing: '-0.03em',
                      color: 'rgba(87, 87, 87, 1)'
                    }}
                  >
                    {auction.assetName}
                  </td>
                  <td 
                    style={{
                      padding: '16px',
                      borderBottom: '1px solid rgba(229, 229, 229, 1)'
                    }}
                  >
                    <StatusTag status={auction.status} />
                  </td>
                  <td 
                    style={{
                      padding: '16px',
                      borderBottom: '1px solid rgba(229, 229, 229, 1)',
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '20px',
                      letterSpacing: '-0.03em',
                      color: 'rgba(87, 87, 87, 1)'
                    }}
                  >
                    {auction.startDate}
                  </td>
                  <td 
                    style={{
                      padding: '16px',
                      borderBottom: '1px solid rgba(229, 229, 229, 1)',
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '20px',
                      letterSpacing: '-0.03em',
                      color: 'rgba(87, 87, 87, 1)'
                    }}
                  >
                    {auction.endDate}
                  </td>
                  <td 
                    style={{
                      padding: '16px',
                      borderBottom: '1px solid rgba(229, 229, 229, 1)'
                    }}
                  >
                    <span 
                      className="inline-flex items-center justify-center"
                      style={{
                        height: '24px',
                        gap: '4px',
                        borderRadius: '4px',
                        borderWidth: '1px',
                        paddingTop: '2px',
                        paddingRight: '6px',
                        paddingBottom: '2px',
                        paddingLeft: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        border: '1px solid rgba(229, 229, 229, 1)',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '20px',
                        letterSpacing: '-0.03em',
                        textAlign: 'center',
                        color: 'rgba(87, 87, 87, 1)',
                        minWidth: '75px'
                      }}
                    >
                      {auction.notice ? (
                        <>
                          <CheckLineIcon style={{ width: '14px', height: '14px', color: 'rgba(103, 170, 56, 1)' }} />
                          Yes
                        </>
                      ) : (
                        <>
                          <CloseLineIcon style={{ width: '14px', height: '14px', color: 'rgba(239, 68, 68, 1)' }} />
                          No
                        </>
                      )}
                    </span>
                  </td>
                  <td 
                    className="text-center"
                    style={{
                      width: '73px',
                      padding: '16px',
                      borderBottom: '1px solid rgba(229, 229, 229, 1)',
                      borderLeft: '1px solid rgba(229, 229, 229, 1)'
                    }}
                  >
                    <div className="relative inline-block">
                      <button
                        onClick={() => toggleMenu(auction.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <PencilLineIcon style={{ width: '20px', height: '20px' }} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openMenuId === auction.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenMenuId(null)}
                          ></div>
                          <div 
                            className="absolute right-0 mt-2 bg-white rounded-lg z-20"
                            style={{
                              width: '200px',
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
                              Actions
                            </div>
                            
                            <button
                              onClick={() => handleViewAction(auction)}
                              className="w-full text-left rounded-lg hover:bg-gray-50 flex items-center"
                              style={{
                                height: '32px',
                                gap: '8px',
                                padding: '4px 6px'
                              }}
                            >
                              <EyeLineIcon style={{ width: '16px', height: '16px' }} />
                              <span
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  lineHeight: '20px',
                                  letterSpacing: '-0.03em',
                                  color: 'rgba(26, 26, 26, 1)'
                                }}
                              >
                                View Details
                              </span>
                            </button>
                            <button
                              onClick={() => handleEditAction(auction)}
                              className="w-full text-left rounded-lg hover:bg-gray-50 flex items-center"
                              style={{
                                height: '32px',
                                gap: '8px',
                                padding: '4px 6px'
                              }}
                            >
                              <EditLineIcon style={{ width: '16px', height: '16px' }} />
                              <span
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  lineHeight: '20px',
                                  letterSpacing: '-0.03em',
                                  color: 'rgba(26, 26, 26, 1)'
                                }}
                              >
                                Edit
                              </span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

AuctionTable.propTypes = {
  auctions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      assetName: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      notice: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
};

export default AuctionTable;

