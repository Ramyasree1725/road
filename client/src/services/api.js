// CivicFix API Client Service with Automatic Backend & Local Mock Fallback

const API_BASE_URL = 'http://localhost:5000/api';

// Initial Mock Seed Data for seamless offline/standalone presentation
const INITIAL_MOCK_COMPLAINTS = [
  {
    _id: 'c1',
    ticketId: 'CF-2026-1011',
    title: 'Deep hazardous potholes on MG Ring Road near Metro Pillar 14',
    description: 'Multiple deep potholes after the recent monsoon rain. Two-wheelers are skidding and causing severe traffic jams during peak morning hours.',
    category: 'Roads & Footpaths',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    reporter: {
      name: 'Ramya Sri',
      email: 'citizen@civicfix.org',
      phone: '+91 91234 56789',
    },
    location: {
      coordinates: [80.265, 13.085],
      address: 'MG Ring Road, Near Metro Pillar 14, Ward 42',
      landmark: 'Opposite State Bank Branch',
      wardOrZone: 'South Ward 42',
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        caption: 'Crater in lane',
      },
    ],
    department: { name: 'Roads & Footpaths Infrastructure', code: 'ROAD' },
    assignedStaff: { name: 'Ramesh Kumar (Roads Lead)' },
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updates: [
      {
        previousStatus: 'NONE',
        newStatus: 'SUBMITTED',
        note: 'Issue reported by citizen via mobile portal.',
        updatedBy: { name: 'Ramya Sri', role: 'citizen' },
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        previousStatus: 'SUBMITTED',
        newStatus: 'VERIFIED',
        note: 'Location and severity inspected by civic desk.',
        updatedBy: { name: 'Admin Triage Desk', role: 'admin' },
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        previousStatus: 'VERIFIED',
        newStatus: 'IN_PROGRESS',
        note: 'Road repair team mobilized with hot asphalt mix on site.',
        updatedBy: { name: 'Ramesh Kumar', role: 'staff' },
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ],
  },
  {
    _id: 'c2',
    ticketId: 'CF-2026-1012',
    title: 'Overflowing commercial dumpster spreading on pedestrian sidewalk',
    description: 'Garbage bin has not been cleared for 4 days. Stray cattle and dogs are scattering waste across the street. Severe foul odor and health hazard.',
    category: 'Waste Management',
    status: 'ASSIGNED',
    priority: 'HIGH',
    reporter: {
      name: 'Suresh Varma',
      email: 'suresh@gmail.com',
      phone: '+91 98480 12345',
    },
    location: {
      coordinates: [80.278, 13.078],
      address: 'Market Yard 3rd Cross, Gandhi Nagar',
      landmark: 'Behind Fruit Market Gate 2',
      wardOrZone: 'Central Zone 12',
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
        caption: 'Overflowing municipal garbage bin',
      },
    ],
    department: { name: 'Solid Waste & Sanitation Department', code: 'WASTE' },
    assignedStaff: { name: 'Sunita Devi (Sanitation Inspector)' },
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updates: [
      {
        previousStatus: 'NONE',
        newStatus: 'SUBMITTED',
        note: 'Garbage accumulation reported.',
        updatedBy: { name: 'Suresh Varma', role: 'citizen' },
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        previousStatus: 'SUBMITTED',
        newStatus: 'ASSIGNED',
        note: 'Assigned to Ward 12 Sanitation truck crew.',
        updatedBy: { name: 'Admin Triage Desk', role: 'admin' },
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ],
  },
  {
    _id: 'c3',
    ticketId: 'CF-2026-1013',
    title: 'Main drinking water pipeline fracture leading to road flooding',
    description: 'Clean drinking water is gushing out under high pressure from underground pipeline crack. Significant water wastage and localized flooding.',
    category: 'Drainage & Water',
    status: 'SUBMITTED',
    priority: 'CRITICAL',
    reporter: {
      name: 'Ramya Sri',
      email: 'citizen@civicfix.org',
      phone: '+91 91234 56789',
    },
    location: {
      coordinates: [80.282, 13.092],
      address: 'Green Meadows Layout, 5th Avenue Junction',
      landmark: 'Near Government High School',
      wardOrZone: 'North Ward 19',
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
        caption: 'Water burst on road surface',
      },
    ],
    department: { name: 'Water Supply & Sewerage Board', code: 'WATER' },
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    updates: [
      {
        previousStatus: 'NONE',
        newStatus: 'SUBMITTED',
        note: 'Critical pipeline burst logged.',
        updatedBy: { name: 'Ramya Sri', role: 'citizen' },
        createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
      },
    ],
  },
  {
    _id: 'c4',
    ticketId: 'CF-2026-1014',
    title: 'Consecutive streetlights non-functional creating pitch dark stretch',
    description: 'Four consecutive LED streetlights on Lake View Promenade have been completely dark for over a week, causing safety concerns for evening walkers.',
    category: 'Street Lighting',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    reporter: {
      name: 'Ramya Sri',
      email: 'citizen@civicfix.org',
      phone: '+91 91234 56789',
    },
    location: {
      coordinates: [80.26, 13.07],
      address: 'Lake View Promenade, Sector 8',
      landmark: 'Near Children Play Park',
      wardOrZone: 'East Ward 05',
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
        caption: 'Streetlights out',
      },
    ],
    resolutionEvidence: [
      {
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        note: 'Replaced burnt fuse, ballast, and LED luminaire. Verified illuminated.',
        resolvedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    feedback: {
      rating: 5,
      comment: 'Super fast action! The promenade is safe and well lit again.',
    },
    department: { name: 'Street Lighting & Public Electricals', code: 'LIGHT' },
    assignedStaff: { name: 'Ramesh Kumar (Roads Lead)' },
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updates: [
      {
        previousStatus: 'NONE',
        newStatus: 'SUBMITTED',
        note: 'Issue reported.',
        updatedBy: { name: 'Ramya Sri', role: 'citizen' },
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        previousStatus: 'SUBMITTED',
        newStatus: 'RESOLVED',
        note: 'Luminaire and line replaced. Tested successfully.',
        updatedBy: { name: 'Ramesh Kumar', role: 'staff' },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  },
];

// Helper to get or set localStorage mock store
const getMockData = () => {
  const stored = localStorage.getItem('civicfix_mock_complaints');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed parsing mock complaints:', e);
    }
  }
  localStorage.setItem('civicfix_mock_complaints', JSON.stringify(INITIAL_MOCK_COMPLAINTS));
  return INITIAL_MOCK_COMPLAINTS;
};

const saveMockData = (complaints) => {
  localStorage.setItem('civicfix_mock_complaints', JSON.stringify(complaints));
};

// Generic request helper with automatic API-to-Mock fallback
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('civicfix_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Server responded with ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    // If backend is offline or unreachable, use mock handlers
    console.warn(`[CivicFix Offline/Fallback Mode for ${endpoint}]:`, err.message);
    return handleMockFallback(endpoint, options);
  }
};

// Standalone Mock Fallback handler for zero-downtime offline execution
const handleMockFallback = async (endpoint, options = {}) => {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : {};
  let complaints = getMockData();

  // 1. Public complaints feed
  if (endpoint.startsWith('/complaints/public')) {
    return { success: true, count: complaints.length, complaints };
  }

  // 2. Track by ticket ID
  if (endpoint.startsWith('/complaints/track/')) {
    const ticketId = endpoint.split('/complaints/track/')[1].trim().toUpperCase();
    const item = complaints.find((c) => c.ticketId.toUpperCase() === ticketId);
    if (!item) {
      throw new Error(`No complaint found with Ticket ID "${ticketId}"`);
    }
    return { success: true, complaint: item, updates: item.updates || [] };
  }

  // 3. User's own complaints
  if (endpoint === '/complaints/my') {
    const userStored = localStorage.getItem('civicfix_user');
    const user = userStored ? JSON.parse(userStored) : { email: 'citizen@civicfix.org' };
    const myItems = complaints.filter((c) => c.reporter.email === user.email);
    const stats = {
      total: myItems.length,
      submitted: myItems.filter((c) => c.status === 'SUBMITTED').length,
      inProgress: myItems.filter((c) => ['ASSIGNED', 'IN_PROGRESS', 'VERIFIED'].includes(c.status)).length,
      resolved: myItems.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length,
      reopened: myItems.filter((c) => c.status === 'REOPENED').length,
    };
    return { success: true, stats, complaints: myItems };
  }

  // 4. Create new complaint
  if (endpoint === '/complaints' && method === 'POST') {
    const userStored = localStorage.getItem('civicfix_user');
    const user = userStored ? JSON.parse(userStored) : { name: 'Active Citizen', email: 'citizen@civicfix.org' };
    const newTicketId = `CF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newComplaint = {
      _id: 'c_' + Date.now(),
      ticketId: newTicketId,
      title: body.title,
      description: body.description,
      category: body.category || 'Roads & Footpaths',
      status: 'SUBMITTED',
      priority: body.priority || 'MEDIUM',
      reporter: {
        name: user.name,
        email: user.email,
        phone: body.phone || '+91 98765 00000',
      },
      location: {
        coordinates: body.coordinates || [80.2707, 13.0827],
        address: body.address,
        landmark: body.landmark || '',
        wardOrZone: body.wardOrZone || 'Central Zone',
      },
      photos: body.photos || [],
      department: { name: 'Civic Triage & Routing' },
      createdAt: new Date().toISOString(),
      updates: [
        {
          previousStatus: 'NONE',
          newStatus: 'SUBMITTED',
          note: 'Issue submitted by citizen via portal.',
          updatedBy: { name: user.name, role: 'citizen' },
          createdAt: new Date().toISOString(),
        },
      ],
    };

    complaints.unshift(newComplaint);
    saveMockData(complaints);
    return { success: true, message: 'Complaint registered successfully', complaint: newComplaint };
  }

  // 5. Admin stats
  if (endpoint === '/admin/stats') {
    const total = complaints.length;
    const open = complaints.filter((c) => ['SUBMITTED', 'UNDER_REVIEW'].includes(c.status)).length;
    const verified = complaints.filter((c) => c.status === 'VERIFIED').length;
    const active = complaints.filter((c) => ['ASSIGNED', 'IN_PROGRESS', 'REOPENED'].includes(c.status)).length;
    const resolved = complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length;

    // Categories aggregation
    const catMap = {};
    complaints.forEach((c) => {
      catMap[c.category] = (catMap[c.category] || 0) + 1;
    });
    const categoryStats = Object.keys(catMap).map((k) => ({ name: k, count: catMap[k] }));

    return {
      success: true,
      stats: {
        total,
        open,
        verified,
        active,
        resolved,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
        totalStaff: 8,
        totalCitizens: 142,
      },
      categoryStats,
      priorityStats: [
        { name: 'CRITICAL', count: complaints.filter((c) => c.priority === 'CRITICAL').length },
        { name: 'HIGH', count: complaints.filter((c) => c.priority === 'HIGH').length },
        { name: 'MEDIUM', count: complaints.filter((c) => c.priority === 'MEDIUM').length },
        { name: 'LOW', count: complaints.filter((c) => c.priority === 'LOW').length },
      ],
      wardStats: [
        { name: 'Central Zone 12', count: 4 },
        { name: 'South Ward 42', count: 3 },
        { name: 'North Ward 19', count: 2 },
        { name: 'East Ward 05', count: 2 },
      ],
    };
  }

  // 6. Admin complaints list
  if (endpoint.startsWith('/admin/complaints') && method === 'GET') {
    return { success: true, count: complaints.length, complaints };
  }

  // 7. Admin status update
  if (endpoint.includes('/status') && method === 'PATCH') {
    const id = endpoint.split('/')[3];
    const item = complaints.find((c) => c._id === id || c.ticketId === id);
    if (item) {
      const prev = item.status;
      item.status = body.status;
      if (body.priority) item.priority = body.priority;
      item.updates = item.updates || [];
      item.updates.unshift({
        previousStatus: prev,
        newStatus: body.status,
        note: body.note || `Status transitioned to ${body.status} by Admin.`,
        updatedBy: { name: 'Civic Admin', role: 'admin' },
        createdAt: new Date().toISOString(),
      });
      saveMockData(complaints);
      return { success: true, complaint: item };
    }
  }

  // 8. Admin assign staff
  if (endpoint.includes('/assign') && method === 'POST') {
    const id = endpoint.split('/')[3];
    const item = complaints.find((c) => c._id === id || c.ticketId === id);
    if (item) {
      item.status = 'ASSIGNED';
      item.assignedStaff = { name: 'Ramesh Kumar (Roads Lead)' };
      item.updates = item.updates || [];
      item.updates.unshift({
        previousStatus: 'VERIFIED',
        newStatus: 'ASSIGNED',
        note: body.note || 'Assigned to field staff for execution.',
        updatedBy: { name: 'Civic Admin', role: 'admin' },
        createdAt: new Date().toISOString(),
      });
      saveMockData(complaints);
      return { success: true, complaint: item };
    }
  }

  // 9. Staff tasks
  if (endpoint === '/staff/tasks') {
    return {
      success: true,
      stats: {
        totalAssigned: complaints.length,
        pendingAction: complaints.filter((c) => c.status === 'ASSIGNED').length,
        inProgress: complaints.filter((c) => c.status === 'IN_PROGRESS').length,
        resolved: complaints.filter((c) => c.status === 'RESOLVED').length,
      },
      tasks: complaints,
    };
  }

  // 10. Staff update progress
  if (endpoint.includes('/tasks/') && endpoint.endsWith('/update')) {
    const id = endpoint.split('/')[3];
    const item = complaints.find((c) => c._id === id || c.ticketId === id);
    if (item) {
      const prev = item.status;
      if (body.status) item.status = body.status;
      if (body.evidencePhotoUrl) {
        item.resolutionEvidence = item.resolutionEvidence || [];
        item.resolutionEvidence.push({
          url: body.evidencePhotoUrl,
          note: body.note || 'Completion proof uploaded',
          resolvedAt: new Date().toISOString(),
        });
      }
      item.updates = item.updates || [];
      item.updates.unshift({
        previousStatus: prev,
        newStatus: item.status,
        note: body.note || 'Work progress updated by staff',
        updatedBy: { name: 'Ramesh Kumar', role: 'staff' },
        evidencePhoto: body.evidencePhotoUrl || '',
        createdAt: new Date().toISOString(),
      });
      saveMockData(complaints);
      return { success: true, complaint: item };
    }
  }

  // 11. Reopen complaint
  if (endpoint.endsWith('/reopen') && method === 'POST') {
    const id = endpoint.split('/')[2];
    const item = complaints.find((c) => c._id === id || c.ticketId === id);
    if (item) {
      item.status = 'REOPENED';
      item.reopenReason = body.reason || 'Citizen unsatisfied with resolution';
      item.reopenCount = (item.reopenCount || 0) + 1;
      item.updates = item.updates || [];
      item.updates.unshift({
        previousStatus: 'RESOLVED',
        newStatus: 'REOPENED',
        note: `Citizen reopened: ${item.reopenReason}`,
        updatedBy: { name: 'Citizen', role: 'citizen' },
        createdAt: new Date().toISOString(),
      });
      saveMockData(complaints);
      return { success: true, complaint: item };
    }
  }

  // 12. Submit feedback
  if (endpoint.endsWith('/feedback') && method === 'POST') {
    const id = endpoint.split('/')[2];
    const item = complaints.find((c) => c._id === id || c.ticketId === id);
    if (item) {
      item.feedback = {
        rating: body.rating || 5,
        comment: body.comment || '',
      };
      item.status = 'CLOSED';
      saveMockData(complaints);
      return { success: true, complaint: item };
    }
  }

  // 13. Notifications
  if (endpoint === '/notifications') {
    return {
      success: true,
      unreadCount: 2,
      notifications: [
        {
          _id: 'n1',
          title: 'Issue In Progress [CF-2026-1011]',
          message: 'Road maintenance crew has commenced patch filling at MG Ring Road.',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isRead: false,
        },
        {
          _id: 'n2',
          title: 'Complaint Resolved [CF-2026-1014]',
          message: 'Streetlights on Lake View Promenade have been successfully fixed and tested.',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          isRead: true,
        },
      ],
    };
  }

  return { success: true, message: 'Simulated response' };
};

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profile) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profile) }),

  // Complaints
  createComplaint: (data) => request('/complaints', { method: 'POST', body: JSON.stringify(data) }),
  getPublicComplaints: (params = '') => request(`/complaints/public${params ? '?' + params : ''}`),
  getMyComplaints: () => request('/complaints/my'),
  getComplaintById: (id) => request(`/complaints/${id}`),
  trackComplaint: (ticketId) => request(`/complaints/track/${ticketId}`),
  reopenComplaint: (id, reason) => request(`/complaints/${id}/reopen`, { method: 'POST', body: JSON.stringify({ reason }) }),
  submitFeedback: (id, feedback) => request(`/complaints/${id}/feedback`, { method: 'POST', body: JSON.stringify(feedback) }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminComplaints: (params = '') => request(`/admin/complaints${params ? '?' + params : ''}`),
  updateAdminStatus: (id, data) => request(`/admin/complaints/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  assignStaff: (id, data) => request(`/admin/complaints/${id}/assign`, { method: 'POST', body: JSON.stringify(data) }),
  getAdminUsers: () => request('/admin/users'),
  getDepartments: () => request('/admin/departments'),

  // Staff
  getStaffTasks: () => request('/staff/tasks'),
  updateStaffProgress: (id, data) => request(`/staff/tasks/${id}/update`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PATCH' }),
};

export default api;
