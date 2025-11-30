/**
 * Mock Data for ESG Configuration Manager
 * Contains dummy data for Sites, Users, Metrics, and Assignments
 */

// Generate 100+ Sites with groups/regions
const siteGroups = ['North Region', 'South Region', 'East Region', 'West Region', 'Central Region'];
const siteTypes = ['Warehouse', 'Office', 'Factory', 'Retail Store', 'Distribution Center', 'Headquarters'];

const generateSites = () => {
  const sites = [];
  for (let i = 1; i <= 105; i++) {
    const group = siteGroups[Math.floor(Math.random() * siteGroups.length)];
    const type = siteTypes[Math.floor(Math.random() * siteTypes.length)];
    sites.push({
      id: `site-${i.toString().padStart(3, '0')}`,
      name: `${type} ${i}`,
      group: group,
      region: group,
    });
  }
  return sites;
};

// Generate 50+ Users
const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica', 'William', 'Ashley', 'James', 'Amanda', 'Christopher', 'Melissa', 'Daniel', 'Michelle', 'Matthew', 'Kimberly', 'Anthony', 'Nicole', 'Mark', 'Stephanie', 'Donald', 'Angela', 'Steven', 'Laura', 'Paul', 'Lisa', 'Andrew', 'Nancy', 'Joshua', 'Karen', 'Kenneth', 'Betty', 'Kevin', 'Helen', 'Brian', 'Sandra', 'George', 'Donna', 'Edward', 'Carol', 'Ronald', 'Ruth', 'Timothy', 'Sharon', 'Jason', 'Michelle', 'Jeffrey', 'Laura'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];

const generateUsers = () => {
  const users = [];
  for (let i = 1; i <= 55; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    users.push({
      id: `user-${i.toString().padStart(3, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    });
  }
  return users;
};

// Generate 30+ Metrics with categories
const metricCategories = {
  Energy: [
    'Electricity Consumption (kWh)',
    'Natural Gas Consumption (m³)',
    'Renewable Energy Generation (kWh)',
    'Energy Efficiency Score',
    'Carbon Emissions from Energy (tCO2e)',
    'Solar Panel Capacity (kW)',
    'Wind Energy Generation (kWh)',
    'Energy Cost (USD)',
  ],
  Water: [
    'Water Consumption (Liters)',
    'Water Recycling Rate (%)',
    'Wastewater Treatment Volume (Liters)',
    'Water Quality Score',
    'Water Cost (USD)',
    'Rainwater Harvesting (Liters)',
  ],
  Waste: [
    'Total Waste Generated (kg)',
    'Waste Recycling Rate (%)',
    'Hazardous Waste (kg)',
    'Organic Waste Composted (kg)',
    'Plastic Waste Reduction (%)',
    'E-Waste Disposed (kg)',
    'Waste-to-Energy Conversion (kWh)',
  ],
  Governance: [
    'ESG Compliance Score',
    'Employee Training Hours',
    'Safety Incidents Count',
    'Diversity & Inclusion Index',
    'Ethics Violations Count',
    'Board Diversity (%)',
    'Stakeholder Engagement Score',
    'Transparency Index',
    'Regulatory Compliance Rate (%)',
  ],
};

const generateMetrics = () => {
  const metrics = [];
  let idCounter = 1;
  
  Object.entries(metricCategories).forEach(([category, metricNames]) => {
    metricNames.forEach((name) => {
      metrics.push({
        id: `metric-${idCounter.toString().padStart(3, '0')}`,
        name: name,
        category: category,
      });
      idCounter++;
    });
  });
  
  return metrics;
};

// Generate sample Assignments (user-site-metric relationships)
// Create realistic assignments - not all combinations, but a good sample
const generateAssignments = (sites, users, metrics) => {
  const assignments = [];
  const assignmentIds = new Set(); // To prevent duplicates
  
  // Generate approximately 500-800 assignments (realistic scenario)
  const targetAssignments = 650;
  
  for (let i = 0; i < targetAssignments; i++) {
    const site = sites[Math.floor(Math.random() * sites.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const metric = metrics[Math.floor(Math.random() * metrics.length)];
    
    // Create unique key to prevent duplicates
    const assignmentKey = `${user.id}-${site.id}-${metric.id}`;
    
    if (!assignmentIds.has(assignmentKey)) {
      assignmentIds.add(assignmentKey);
      assignments.push({
        id: `assignment-${assignments.length + 1}`,
        userId: user.id,
        siteId: site.id,
        metricId: metric.id,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(), // Random date in last 90 days
      });
    }
  }
  
  return assignments;
};

// Generate all data
const sites = generateSites();
const users = generateUsers();
const metrics = generateMetrics();
const assignments = generateAssignments(sites, users, metrics);

// Export the data
export const esgMockData = {
  sites,
  users,
  metrics,
  assignments,
  metricCategories: Object.keys(metricCategories),
};

// Helper functions to get data by ID
export const getSiteById = (siteId) => sites.find(s => s.id === siteId);
export const getUserById = (userId) => users.find(u => u.id === userId);
export const getMetricById = (metricId) => metrics.find(m => m.id === metricId);

// Helper function to get assignments for a specific site-metric combination
export const getAssignmentsForSiteMetric = (siteId, metricId) => {
  return assignments.filter(a => a.siteId === siteId && a.metricId === metricId);
};

// Helper function to get all assignments for a user
export const getAssignmentsForUser = (userId) => {
  return assignments.filter(a => a.userId === userId);
};

// Helper function to get all assignments for a site
export const getAssignmentsForSite = (siteId) => {
  return assignments.filter(a => a.siteId === siteId);
};

// Helper function to get all assignments for a metric
export const getAssignmentsForMetric = (metricId) => {
  return assignments.filter(a => a.metricId === metricId);
};

// Helper function to check if assignment exists
export const assignmentExists = (userId, siteId, metricId) => {
  return assignments.some(a => 
    a.userId === userId && 
    a.siteId === siteId && 
    a.metricId === metricId
  );
};

// Helper function to create a new assignment
export const createAssignment = (userId, siteId, metricId) => {
  // Check if assignment already exists
  if (assignmentExists(userId, siteId, metricId)) {
    return null; // Duplicate
  }
  
  const newAssignment = {
    id: `assignment-${assignments.length + 1}`,
    userId,
    siteId,
    metricId,
    createdAt: new Date().toISOString(),
  };
  
  assignments.push(newAssignment);
  return newAssignment;
};

// Helper function to remove an assignment
export const removeAssignment = (assignmentId) => {
  const index = assignments.findIndex(a => a.id === assignmentId);
  if (index !== -1) {
    assignments.splice(index, 1);
    return true;
  }
  return false;
};

// Helper function to get user count for a site-metric combination
export const getUserCountForSiteMetric = (siteId, metricId) => {
  return getAssignmentsForSiteMetric(siteId, metricId).length;
};


