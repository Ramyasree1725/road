const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Department = require('../models/Department');
const Complaint = require('../models/Complaint');
const ComplaintUpdate = require('../models/ComplaintUpdate');
const Notification = require('../models/Notification');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civicfix';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Department.deleteMany();
    await Complaint.deleteMany();
    await ComplaintUpdate.deleteMany();
    await Notification.deleteMany();

    console.log('Previous database collections cleared.');

    // 1. Create Departments
    const departments = await Department.create([
      {
        name: 'Roads & Footpaths Infrastructure',
        code: 'ROAD',
        description: 'Road repairs, pothole filling, sidewalk maintenance, and road signages.',
        contactEmail: 'roads@civicfix.org',
        contactPhone: '+91 98765 43210',
        headOfficer: 'Eng. K. Venkatesh',
        categories: ['Roads & Footpaths'],
      },
      {
        name: 'Solid Waste & Sanitation Department',
        code: 'WASTE',
        description: 'Garbage collection, overflowing dumpsters, community composting, and street sweepers.',
        contactEmail: 'sanitation@civicfix.org',
        contactPhone: '+91 98765 43211',
        headOfficer: 'Mrs. S. Lakshmi',
        categories: ['Waste Management'],
      },
      {
        name: 'Water Supply & Sewerage Board',
        code: 'WATER',
        description: 'Water pipelines leakage, contaminated tap water, storm drainage clogs, and manhole repairs.',
        contactEmail: 'waterworks@civicfix.org',
        contactPhone: '+91 98765 43212',
        headOfficer: 'Mr. P. Nageswara Rao',
        categories: ['Drainage & Water'],
      },
      {
        name: 'Street Lighting & Public Electricals',
        code: 'LIGHT',
        description: 'Streetlight maintenance, faulty timers, hanging wires, and solar pole repairs.',
        contactEmail: 'electrical@civicfix.org',
        contactPhone: '+91 98765 43213',
        headOfficer: 'Mr. B. Ravinder',
        categories: ['Street Lighting'],
      },
      {
        name: 'Parks, Horticulture & Urban Forestry',
        code: 'PARK',
        description: 'Fallen trees, park upkeep, damaged public benches, and open grounds maintenance.',
        contactEmail: 'parks@civicfix.org',
        contactPhone: '+91 98765 43214',
        headOfficer: 'Ms. Anitha Reddy',
        categories: ['Parks & Trees', 'Other Civic Issues', 'Public Health'],
      },
    ]);

    console.log(`Created ${departments.length} departments.`);

    // 2. Create Users (Admin, Staff, Citizen)
    const adminUser = await User.create({
      name: 'Civic Administrator',
      email: 'admin@civicfix.org',
      password: 'admin123',
      role: 'admin',
      phone: '+91 90000 00001',
    });

    const staffUser1 = await User.create({
      name: 'Ramesh Kumar (Roads Lead)',
      email: 'staff@civicfix.org',
      password: 'staff123',
      role: 'staff',
      phone: '+91 90000 00002',
      department: departments[0]._id,
    });

    const staffUser2 = await User.create({
      name: 'Sunita Devi (Sanitation Inspector)',
      email: 'sunita.staff@civicfix.org',
      password: 'staff123',
      role: 'staff',
      phone: '+91 90000 00003',
      department: departments[1]._id,
    });

    const citizenUser1 = await User.create({
      name: 'Ramya Sri',
      email: 'citizen@civicfix.org',
      password: 'citizen123',
      role: 'citizen',
      phone: '+91 91234 56789',
    });

    const citizenUser2 = await User.create({
      name: 'Suresh Varma',
      email: 'suresh@gmail.com',
      password: 'citizen123',
      role: 'citizen',
      phone: '+91 98480 12345',
    });

    console.log('Created Users: Admin, Staff (x2), Citizens (x2)');

    // 3. Seed Realistic Complaints
    const complaintsData = [
      {
        ticketId: 'CF-2026-1011',
        title: 'Deep hazardous potholes on MG Ring Road near Metro Pillar 14',
        description: 'Multiple deep potholes after the recent monsoon rain. Two-wheelers are skidding and causing severe traffic jams during peak morning hours.',
        category: 'Roads & Footpaths',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        reporter: {
          user: citizenUser1._id,
          name: citizenUser1.name,
          email: citizenUser1.email,
          phone: citizenUser1.phone,
        },
        department: departments[0]._id,
        assignedStaff: staffUser1._id,
        location: {
          type: 'Point',
          coordinates: [80.265, 13.085],
          address: 'MG Ring Road, Near Metro Pillar 14, Ward 42',
          landmark: 'Opposite State Bank Branch',
          wardOrZone: 'South Ward 42',
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
            caption: 'Large crater in middle of lane',
          },
        ],
        resolutionEvidence: [
          {
            url: 'https://images.unsplash.com/photo-1584463699042-2b6d194cf346?auto=format&fit=crop&w=800&q=80',
            note: 'Hot bituminous asphalt mix laid and compacted flush with roller by Lead Ramesh Kumar and Crew #4.',
            resolvedAt: new Date(),
          },
        ],
      },
      {
        ticketId: 'CF-2026-1012',
        title: 'Overflowing commercial dumpster spreading on pedestrian sidewalk',
        description: 'Garbage bin has not been cleared for 4 days. Stray cattle and dogs are scattering waste across the street. Severe foul odor and health hazard.',
        category: 'Waste Management',
        status: 'ASSIGNED',
        priority: 'HIGH',
        reporter: {
          user: citizenUser2._id,
          name: citizenUser2.name,
          email: citizenUser2.email,
          phone: citizenUser2.phone,
        },
        department: departments[1]._id,
        assignedStaff: staffUser2._id,
        location: {
          type: 'Point',
          coordinates: [80.278, 13.078],
          address: 'Market Yard 3rd Cross, Gandhi Nagar',
          landmark: 'Behind Fruit Market Gate 2',
          wardOrZone: 'Central Zone 12',
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
            caption: 'Municipal sanitation crew clearing bin',
          },
        ],
      },
      {
        ticketId: 'CF-2026-1013',
        title: 'Main drinking water pipeline fracture leading to road flooding',
        description: 'Clean drinking water is gushing out under high pressure from underground pipeline crack. Significant water wastage and localized flooding.',
        category: 'Drainage & Water',
        status: 'SUBMITTED',
        priority: 'CRITICAL',
        reporter: {
          user: citizenUser1._id,
          name: citizenUser1.name,
          email: citizenUser1.email,
          phone: citizenUser1.phone,
        },
        department: departments[2]._id,
        location: {
          type: 'Point',
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
      },
      {
        ticketId: 'CF-2026-1014',
        title: 'Consecutive streetlights non-functional creating pitch dark stretch',
        description: 'Four consecutive LED streetlights on Lake View Promenade have been completely dark for over a week, causing safety concerns for women and evening walkers.',
        category: 'Street Lighting',
        status: 'RESOLVED',
        priority: 'MEDIUM',
        reporter: {
          user: citizenUser1._id,
          name: citizenUser1.name,
          email: citizenUser1.email,
          phone: citizenUser1.phone,
        },
        department: departments[3]._id,
        assignedStaff: staffUser1._id,
        location: {
          type: 'Point',
          coordinates: [80.26, 13.07],
          address: 'Lake View Promenade, Sector 8',
          landmark: 'Near Children Play Park',
          wardOrZone: 'East Ward 05',
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
            caption: 'Non working streetlights at night',
          },
        ],
        resolutionEvidence: [
          {
            url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
            note: 'Replaced faulty circuit breakers and burned LED ballast. All 4 lights tested and operational by Lineman Ravinder.',
            resolvedAt: new Date(Date.now() - 86400000),
          },
        ],
        feedback: {
          rating: 5,
          comment: 'Quick and responsive fix by municipal electrical crew! Lights are bright now.',
          submittedAt: new Date(),
        },
      },
      {
        ticketId: 'CF-2026-1015',
        title: 'Huge fallen tree branch blocking half lane after storm winds',
        description: 'Large banyan branch snapped and fallen onto the vehicular road. Needs motorized wood saw cutting and immediate clearance.',
        category: 'Parks & Trees',
        status: 'VERIFIED',
        priority: 'MEDIUM',
        reporter: {
          user: citizenUser2._id,
          name: citizenUser2.name,
          email: citizenUser2.email,
          phone: citizenUser2.phone,
        },
        department: departments[4]._id,
        location: {
          type: 'Point',
          coordinates: [80.271, 13.065],
          address: 'Circular Garden Road, Block D',
          landmark: 'Adjacent to Community Center',
          wardOrZone: 'Central Zone 12',
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
            caption: 'Fallen branch obstructing traffic',
          },
        ],
      },
    ];

    for (const cData of complaintsData) {
      const complaint = await Complaint.create(cData);

      // Create history update
      await ComplaintUpdate.create({
        complaint: complaint._id,
        ticketId: complaint.ticketId,
        previousStatus: 'NONE',
        newStatus: complaint.status,
        note: `Complaint initialized in status ${complaint.status} during system onboarding.`,
        updatedBy: {
          user: adminUser._id,
          name: 'Civic System',
          role: 'admin',
        },
      });
    }

    console.log(`Created ${complaintsData.length} realistic complaints and timeline logs.`);

    // 4. Create Notifications
    await Notification.create([
      {
        recipient: citizenUser1._id,
        title: 'Complaint CF-2026-1014 Resolved',
        message: 'Your report regarding broken streetlights on Lake View Promenade has been resolved by field staff.',
        type: 'STATUS_CHANGE',
        ticketId: 'CF-2026-1014',
      },
      {
        recipient: citizenUser1._id,
        title: 'Work In Progress on CF-2026-1011',
        message: 'Roads repair team has arrived on site at MG Ring Road. Asphalt leveling in progress.',
        type: 'STATUS_CHANGE',
        ticketId: 'CF-2026-1011',
      },
      {
        recipient: staffUser1._id,
        title: 'Priority Work Assigned',
        message: 'You have been assigned to inspect and fix hazardous potholes on MG Ring Road [CF-2026-1011].',
        type: 'ASSIGNMENT',
        ticketId: 'CF-2026-1011',
      },
    ]);

    console.log('✅ CivicFix Database Seed Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
};

seedDatabase();
