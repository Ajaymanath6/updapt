import { StatWidget, TaskList } from '../components/dashboard';
import { Card } from '../components/common';
import { mockDashboardData } from '../lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AuctionLineIcon from 'remixicon-react/AuctionLineIcon';
import BroadcastLineIcon from 'remixicon-react/BroadcastLineIcon';
import StackLineIcon from 'remixicon-react/StackLineIcon';
import Building2LineIcon from 'remixicon-react/Building2LineIcon';
import CurrencyLineIcon from 'remixicon-react/CurrencyLineIcon';
import AlertLineIcon from 'remixicon-react/AlertLineIcon';
import GroupLineIcon from 'remixicon-react/GroupLineIcon';

/**
 * DashboardPage - Main dashboard view with KPIs, charts, and tasks
 */
const DashboardPage = () => {
  // Megaphone SVG component (same as sidebar)
  const MegaphoneSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
      <path d="M9 17C9 17 16 18 19 21H20C20.5523 21 21 20.5523 21 20V13.937C21.8626 13.715 22.5 12.9319 22.5 12C22.5 11.0681 21.8626 10.285 21 10.063V4C21 3.44772 20.5523 3 20 3H19C16 6 9 7 9 7H5C3.89543 7 3 7.89543 3 9V15C3 16.1046 3.89543 17 5 17H6L7 22H9V17ZM11 8.6612C11.6833 8.5146 12.5275 8.31193 13.4393 8.04373C15.1175 7.55014 17.25 6.77262 19 5.57458V18.4254C17.25 17.2274 15.1175 16.4499 13.4393 15.9563C12.5275 15.6881 11.6833 15.4854 11 15.3388V8.6612ZM5 9H9V15H5V9Z"/>
    </svg>
  );

  const iconMap = {
    auction: AuctionLineIcon,
    broadcast: MegaphoneSVG,
    building: StackLineIcon,
    alert: AlertLineIcon,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
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
          Dashboard
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
          Welcome back! Here's an overview of your platform activity.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockDashboardData.kpis.map((kpi) => (
          <StatWidget
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            icon={iconMap[kpi.icon]}
            iconBgColor={kpi.iconBgColor}
            iconColor={kpi.iconColor}
            valueByPeriod={kpi.valueByPeriod}
          />
        ))}
      </div>

      {/* Charts and Tasks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section - Spans 2 columns */}
        <div className="lg:col-span-2">
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Auction Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockDashboardData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#073370" name="Completed Auctions" />
                <Bar dataKey="active" fill="#10b981" name="Active Auctions" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Tasks Section - Spans 1 column */}
        <div className="lg:col-span-1">
          <TaskList title="Recent Alerts & Tasks" items={mockDashboardData.tasks} />
        </div>
      </div>

      {/* Quick Stats Section */}
      <div>
        {/* Heading Outside Card */}
        <h2 
          className="mb-4"
          style={{
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: '28px',
            letterSpacing: '-0.03em',
            color: 'rgba(26, 26, 26, 1)'
          }}
        >
          Quick Stats
        </h2>
        
        {/* Card with 3 Divisions */}
        <div 
          className="bg-white rounded-lg border w-full max-w-full"
          style={{
            height: '123px',
            borderRadius: '8px',
            borderWidth: '1px',
            padding: '12px',
            borderColor: 'rgba(229, 229, 229, 1)',
            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0'
          }}
        >
          {/* Division 1: Auction Success Rate */}
          <div 
            style={{
              height: '99px',
              gap: '4px',
              display: 'flex',
              flexDirection: 'column',
              paddingRight: '12px',
              borderRight: '1px solid rgba(229, 229, 229, 1)'
            }}
          >
            <div className="flex items-center" style={{ gap: '4px' }}>
              <div 
                className="p-1 rounded-lg"
                style={{
                  backgroundColor: 'transparent',
                  color: '#073370'
                }}
              >
                <AuctionLineIcon style={{ width: '20px', height: '20px' }} />
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
                Auction Success Rate
              </p>
            </div>
            <div 
              style={{
                fontSize: '32px',
                fontWeight: 700,
                lineHeight: '110%',
                letterSpacing: '-0.03em',
                color: 'rgba(26, 26, 26, 1)',
                marginTop: '8px'
              }}
            >
              89%
            </div>
            <div 
              style={{
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '20px',
                letterSpacing: '-0.03em',
                color: 'rgba(87, 87, 87, 1)',
                marginTop: '4px'
              }}
            >
              19 Monday - 26 Sunday
            </div>
          </div>

          {/* Division 2: Total Revenue */}
          <div 
            style={{
              height: '99px',
              gap: '4px',
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: '12px',
              paddingRight: '12px',
              borderRight: '1px solid rgba(229, 229, 229, 1)'
            }}
          >
            <div className="flex items-center" style={{ gap: '4px' }}>
              <div 
                className="p-1 rounded-lg"
                style={{
                  backgroundColor: 'transparent',
                  color: '#073370'
                }}
              >
                <CurrencyLineIcon style={{ width: '20px', height: '20px' }} />
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
                Total Revenue
              </p>
            </div>
            <div 
              style={{
                fontSize: '32px',
                fontWeight: 700,
                lineHeight: '110%',
                letterSpacing: '-0.03em',
                color: 'rgba(26, 26, 26, 1)',
                marginTop: '8px'
              }}
            >
              ₹24,00,000
            </div>
            <div 
              style={{
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '20px',
                letterSpacing: '-0.03em',
                color: 'rgba(87, 87, 87, 1)',
                marginTop: '4px'
              }}
            >
              19 Monday - 26 Sunday
            </div>
          </div>

          {/* Division 3: Active Bidders */}
          <div 
            style={{
              height: '99px',
              gap: '4px',
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: '12px'
            }}
          >
            <div className="flex items-center" style={{ gap: '4px' }}>
              <div 
                className="p-1 rounded-lg"
                style={{
                  backgroundColor: 'transparent',
                  color: '#073370'
                }}
              >
                <GroupLineIcon style={{ width: '20px', height: '20px' }} />
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
                Active Bidders
              </p>
            </div>
            <div 
              style={{
                fontSize: '32px',
                fontWeight: 700,
                lineHeight: '110%',
                letterSpacing: '-0.03em',
                color: 'rgba(26, 26, 26, 1)',
                marginTop: '8px'
              }}
            >
              156
            </div>
            <div 
              style={{
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '20px',
                letterSpacing: '-0.03em',
                color: 'rgba(87, 87, 87, 1)',
                marginTop: '4px'
              }}
            >
              19 Monday - 26 Sunday
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

