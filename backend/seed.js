const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Load env vars
dotenv.config({ path: "./.env" });

// Load models
const User = require("./models/User");
const BloodBank = require("./models/BloodBank");
const Request = require("./models/Request");
const Organization = require("./models/Organization");
const BloodCamp = require("./models/BloodCamp");
const DonationHistory = require("./models/DonationHistory");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Kerala cities - focused on central Kerala
const cities = [
  "Thrissur",
  "Ernakulam",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Kottayam",
  "Kollam",
  "Thiruvananthapuram",
];

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = ["low", "medium", "high", "critical"];

// Kerala common names
const malayalamNames = {
  firstNames: [
    "Arun",
    "Vijay",
    "Suresh",
    "Ramesh",
    "Krishna",
    "Priya",
    "Lakshmi",
    "Anjali",
    "Divya",
    "Sreelakshmi",
    "Rajesh",
    "Mahesh",
    "Anoop",
    "Deepak",
    "Sreekanth",
    "Meera",
    "Kavya",
    "Sneha",
    "Asha",
    "Nisha",
  ],
  lastNames: [
    "Menon",
    "Nair",
    "Pillai",
    "Kumar",
    "Raj",
    "Varma",
    "Iyer",
    "Namboothiri",
    "Panicker",
    "Achari",
  ],
};

// Generate VERIFIED Indian phone number (EXACTLY 10 digits)
const generatePhone = () => {
  // First digit: 9, 8, or 7 (valid Indian mobile prefixes)
  const firstDigit = [9, 8, 7][Math.floor(Math.random() * 3)];

  // Generate exactly 9 more digits
  let remainingDigits = "";
  for (let i = 0; i < 9; i++) {
    remainingDigits += Math.floor(Math.random() * 10);
  }

  const phone = firstDigit + remainingDigits;

  // VERIFY: Log and check length
  if (phone.length !== 10) {
    console.error(
      `❌ ERROR: Generated phone ${phone} is ${phone.length} digits, not 10!`
    );
  }

  return phone;
};

// Generate Kerala address
const generateAddress = () => {
  const houseNames = [
    "Sree Nilayam",
    "Lakshmi Bhavan",
    "Krishna Cottage",
    "Pournami",
    "Sowparnika",
    "Devaki Nivas",
    "Murali Mandiram",
    "Anand Bhavan",
    "Hari Bhavan",
    "Vishnu Vilasam",
    "Ganga",
    "Yamuna",
  ];
  const locations = [
    "East Fort",
    "West Fort",
    "Shakthan Thampuran Road",
    "Round",
    "Punkunnam",
    "Ollur",
    "Irinjalakuda Road",
    "Guruvayur Road",
    "Chavakkad",
    "Kodungallur",
    "Ayyanthole",
    "Thrissur-Kunnamkulam Road",
  ];

  return `${houseNames[Math.floor(Math.random() * houseNames.length)]}, ${
    locations[Math.floor(Math.random() * locations.length)]
  }`;
};

// Generate random Kerala name
const generateName = () => {
  const firstName =
    malayalamNames.firstNames[
      Math.floor(Math.random() * malayalamNames.firstNames.length)
    ];
  const lastName =
    malayalamNames.lastNames[
      Math.floor(Math.random() * malayalamNames.lastNames.length)
    ];
  return `${firstName} ${lastName}`;
};

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Create Users
const createUsers = async () => {
  const hashedPassword = await hashPassword("password123");

  const users = [
    // Admin user
    {
      name: "Admin Kumar",
      email: "admin@bloodlife.com",
      password: hashedPassword,
      phone: "9876543210", // VERIFIED 10 digits
      bloodType: "O+",
      city: "Thrissur",
      role: "admin",
      isActive: true,
    },
    // Regular users from Thrissur and nearby
    {
      name: "Arun Menon",
      email: "arun.menon@example.com",
      password: hashedPassword,
      phone: generatePhone(),
      bloodType: "A+",
      city: "Thrissur",
      role: "user",
      isActive: true,
    },
    {
      name: "Priya Nair",
      email: "priya.nair@example.com",
      password: hashedPassword,
      phone: generatePhone(),
      bloodType: "B+",
      city: "Thrissur",
      role: "user",
      isActive: true,
    },
    {
      name: "Vijay Kumar",
      email: "vijay.kumar@example.com",
      password: hashedPassword,
      phone: generatePhone(),
      bloodType: "O-",
      city: "Ernakulam",
      role: "user",
      isActive: true,
    },
    {
      name: "Lakshmi Pillai",
      email: "lakshmi.pillai@example.com",
      password: hashedPassword,
      phone: generatePhone(),
      bloodType: "AB+",
      city: "Thrissur",
      role: "user",
      isActive: true,
    },
    {
      name: "Rajesh Varma",
      email: "rajesh.varma@example.com",
      password: hashedPassword,
      phone: generatePhone(),
      bloodType: "A-",
      city: "Palakkad",
      role: "user",
      isActive: true,
    },
    {
      name: "Anjali Raj",
      email: "anjali.raj@example.com",
      password: hashedPassword,
      phone: generatePhone(),
      bloodType: "B-",
      city: "Kozhikode",
      role: "user",
      isActive: true,
    },
    {
      name: "Suresh Iyer",
      email: "suresh.iyer@example.com",
      password: hashedPassword,
      phone: generatePhone(),
      bloodType: "O+",
      city: "Thrissur",
      role: "user",
      isActive: true,
    },
    {
      name: "Divya Menon",
      email: "divya.menon@example.com",
      password: hashedPassword,
      phone: generatePhone(),
      bloodType: "AB-",
      city: "Ernakulam",
      role: "user",
      isActive: true,
    },
    {
      name: "Mahesh Panicker",
      email: "mahesh.panicker@example.com",
      password: hashedPassword,
      phone: generatePhone(),
      bloodType: "A+",
      city: "Thrissur",
      role: "user",
      isActive: true,
    },
    {
      name: "Meera Nair",
      email: "meera.nair@example.com",
      password: hashedPassword,
      phone: generatePhone(),
      bloodType: "B+",
      city: "Malappuram",
      role: "user",
      isActive: true,
    },
    {
      name: "Krishna Kumar",
      email: "krishna.kumar@example.com",
      password: hashedPassword,
      phone: generatePhone(),
      bloodType: "O+",
      city: "Thrissur",
      role: "user",
      isActive: true,
    },
    {
      name: "Sreelakshmi Pillai",
      email: "sreelakshmi.pillai@example.com",
      password: hashedPassword,
      phone: generatePhone(),
      bloodType: "A-",
      city: "Kottayam",
      role: "user",
      isActive: true,
    },
    {
      name: "Ramesh Menon",
      email: "ramesh.menon@example.com",
      password: hashedPassword,
      phone: generatePhone(),
      bloodType: "B+",
      city: "Thrissur",
      role: "user",
      isActive: true,
    },
    {
      name: "Kavya Raj",
      email: "kavya.raj@example.com",
      password: hashedPassword,
      phone: generatePhone(),
      bloodType: "AB+",
      city: "Thiruvananthapuram",
      role: "user",
      isActive: true,
    },
  ];

  const createdUsers = await User.insertMany(users);
  console.log(`✅ Created ${createdUsers.length} users`);

  // VERIFY all phone numbers are 10 digits
  let phoneErrors = 0;
  createdUsers.forEach((user) => {
    if (user.phone.length !== 10) {
      console.error(
        `❌ User ${user.name} has invalid phone: ${user.phone} (${user.phone.length} digits)`
      );
      phoneErrors++;
    }
  });

  if (phoneErrors === 0) {
    console.log("✅ All user phone numbers verified: 10 digits");
  } else {
    console.error(`❌ Found ${phoneErrors} invalid phone numbers!`);
  }

  return createdUsers;
};

// Create Blood Banks
const createBloodBanks = async () => {
  const hashedPassword = await hashPassword("bloodbank123");

  const bloodBanks = [
    {
      name: "Thrissur District Blood Bank",
      email: "contact@thrissurbloodbank.com",
      password: hashedPassword,
      phone: "0487242424", // Landline format for blood banks
      address: "Government Medical College, Thrissur",
      city: "Thrissur",
      licenseNumber: "BB-KL-TCR-001-2024",
      isApproved: true,
      isActive: true,
    },
    {
      name: "Jubilee Mission Blood Centre",
      email: "info@jubileemissionblood.com",
      password: hashedPassword,
      phone: "0487242777", // Landline
      address: "Jubilee Mission Hospital, Thrissur",
      city: "Thrissur",
      licenseNumber: "BB-KL-TCR-002-2024",
      isApproved: true,
      isActive: true,
    },
    {
      name: "Ernakulam Medical Centre Blood Bank",
      email: "blood@ernakulammedical.com",
      password: hashedPassword,
      phone: "9876543211", // Mobile for some blood banks
      address: "NH Bypass, Ernakulam",
      city: "Ernakulam",
      licenseNumber: "BB-KL-EKM-003-2024",
      isApproved: true,
      isActive: true,
    },
    {
      name: "Amala Institute of Medical Sciences Blood Bank",
      email: "bloodbank@amalahealth.org",
      password: hashedPassword,
      phone: "0487230430", // Landline
      address: "Amala Nagar, Thrissur",
      city: "Thrissur",
      licenseNumber: "BB-KL-TCR-004-2024",
      isApproved: true,
      isActive: true,
    },
    {
      name: "Kozhikode Medical College Blood Bank",
      email: "support@kozhikodeblood.com",
      password: hashedPassword,
      phone: "9123456789", // Mobile
      address: "Medical College Campus, Kozhikode",
      city: "Kozhikode",
      licenseNumber: "BB-KL-CLT-005-2024",
      isApproved: true,
      isActive: true,
    },
    {
      name: "Palakkad District Hospital Blood Bank",
      email: "blood@palakkadhealth.com",
      password: hashedPassword,
      phone: "8765432109", // Mobile
      address: "District Hospital, Palakkad",
      city: "Palakkad",
      licenseNumber: "BB-KL-PKD-006-2024",
      isApproved: false, // Pending approval
      isActive: true,
    },
    {
      name: "Kottayam Medical College Blood Centre",
      email: "info@kottayamblood.com",
      password: hashedPassword,
      phone: "7654321098", // Mobile
      address: "Medical College, Kottayam",
      city: "Kottayam",
      licenseNumber: "BB-KL-KTM-007-2024",
      isApproved: false, // Pending approval
      isActive: true,
    },
    {
      name: "Lissie Hospital Blood Bank",
      email: "bloodbank@lissiehospital.com",
      password: hashedPassword,
      phone: "9876543212", // Mobile
      address: "Lissie Hospital, Ernakulam",
      city: "Ernakulam",
      licenseNumber: "BB-KL-EKM-008-2024",
      isApproved: true,
      isActive: true,
    },
  ];

  const createdBloodBanks = await BloodBank.insertMany(bloodBanks);
  console.log(`✅ Created ${createdBloodBanks.length} blood banks`);

  // VERIFY all phone numbers are 10 digits
  let phoneErrors = 0;
  createdBloodBanks.forEach((bank) => {
    if (bank.phone.length !== 10) {
      console.error(
        `❌ Blood Bank ${bank.name} has invalid phone: ${bank.phone} (${bank.phone.length} digits)`
      );
      phoneErrors++;
    }
  });

  if (phoneErrors === 0) {
    console.log("✅ All blood bank phone numbers verified: 10 digits");
  } else {
    console.error(`❌ Found ${phoneErrors} invalid phone numbers!`);
  }

  // Update inventory for approved blood banks
  for (const bank of createdBloodBanks) {
    if (bank.isApproved) {
      bank.inventory = bloodTypes.map((type) => ({
        bloodType: type,
        quantity: Math.floor(Math.random() * 50) + 10, // Random quantity between 10-60
      }));
      await bank.save();
    }
  }
  console.log("✅ Updated blood bank inventories");

  return createdBloodBanks;
};

// Create Organizations (Hospitals, NGOs, Colleges)
const createOrganizations = async () => {
  const hashedPassword = await hashPassword("organization123");

  const organizations = [
    // Verified Hospitals in Thrissur
    {
      name: "Jubilee Mission Medical College & Research Institute",
      type: "hospital",
      email: "admin@jubileemission.org",
      password: hashedPassword,
      phone: "9447123456",
      address: "Jubilee Mission P.O., Thrissur",
      city: "Thrissur",
      registrationNumber: "HOSP-KL-TCR-001",
      contactPerson: {
        name: "Dr. Suresh Kumar",
        designation: "Medical Superintendent",
        phone: "9447123457",
      },
      established: new Date("1990-01-15"),
      description:
        "Premier multi-specialty hospital in Thrissur providing comprehensive healthcare services and conducting blood donation camps regularly.",
      isVerified: true,
    },
    {
      name: "Amala Institute of Medical Sciences",
      type: "hospital",
      email: "bloodcamp@amalahealth.org",
      password: hashedPassword,
      phone: "9447234567",
      address: "Amala Nagar, Amalanagar P.O., Thrissur",
      city: "Thrissur",
      registrationNumber: "HOSP-KL-TCR-002",
      contactPerson: {
        name: "Dr. Radhika Menon",
        designation: "Head of Blood Bank",
        phone: "9447234568",
      },
      established: new Date("1978-06-01"),
      description:
        "A leading healthcare institution committed to patient care and community service through regular blood donation drives.",
      isVerified: true,
    },
    {
      name: "Elite Mission Hospital",
      type: "hospital",
      email: "info@elitemission.com",
      password: hashedPassword,
      phone: "9447345678",
      address: "Mannuthy, Thrissur",
      city: "Thrissur",
      registrationNumber: "HOSP-KL-TCR-003",
      contactPerson: {
        name: "Dr. Anoop Raj",
        designation: "Director",
        phone: "9447345679",
      },
      established: new Date("2005-03-20"),
      description:
        "Modern multi-specialty hospital organizing monthly blood donation camps in association with local blood banks.",
      isVerified: false, // Pending verification
    },

    // Verified NGOs in Thrissur
    {
      name: "Thrissur Blood Donors' Association",
      type: "ngo",
      email: "contact@thrissurblooddonors.org",
      password: hashedPassword,
      phone: "9447456789",
      address: "Round East, Thrissur",
      city: "Thrissur",
      registrationNumber: "NGO-KL-TCR-001",
      contactPerson: {
        name: "Rajesh Varma",
        designation: "President",
        phone: "9447456790",
      },
      established: new Date("2010-08-15"),
      description:
        "Leading NGO dedicated to organizing voluntary blood donation camps across Thrissur district. Successfully conducted over 500 camps.",
      isVerified: true,
    },
    {
      name: "Kerala Voluntary Blood Donors Forum - Thrissur Chapter",
      type: "ngo",
      email: "thrissur@kvbdf.org",
      password: hashedPassword,
      phone: "9447567890",
      address: "Shakthan Thampuran Road, Thrissur",
      city: "Thrissur",
      registrationNumber: "NGO-KL-TCR-002",
      contactPerson: {
        name: "Priya Krishnan",
        designation: "Chapter Coordinator",
        phone: "9447567891",
      },
      established: new Date("2008-01-10"),
      description:
        "Part of state-wide network promoting voluntary blood donation. Organizes awareness programs and donation camps in educational institutions.",
      isVerified: true,
    },
    {
      name: "Life Savers Blood Donation Society",
      type: "ngo",
      email: "info@lifesavers.org",
      password: hashedPassword,
      phone: "9447678901",
      address: "Punkunnam, Thrissur",
      city: "Thrissur",
      registrationNumber: "NGO-KL-TCR-003",
      contactPerson: {
        name: "Mahesh Pillai",
        designation: "Secretary",
        phone: "9447678902",
      },
      established: new Date("2015-04-22"),
      description:
        "Youth-driven NGO focusing on creating awareness about blood donation in rural areas of Thrissur.",
      isVerified: false, // Pending verification
    },

    // Colleges in Thrissur
    {
      name: "Government Engineering College Thrissur",
      type: "college",
      email: "nss@gectcr.ac.in",
      password: hashedPassword,
      phone: "9447789012",
      address: "Thrissur - Palakkad Hwy, Thrissur",
      city: "Thrissur",
      registrationNumber: "COL-KL-TCR-001",
      contactPerson: {
        name: "Prof. Sreekumar Nair",
        designation: "NSS Program Officer",
        phone: "9447789013",
      },
      established: new Date("1957-06-01"),
      description:
        "Premier engineering college conducting bi-annual blood donation camps through NSS unit. Over 500 students participate each year.",
      isVerified: true,
    },
    {
      name: "St. Thomas College Thrissur",
      type: "college",
      email: "bloodcamp@stthomas.ac.in",
      password: hashedPassword,
      phone: "9447890123",
      address: "College Road, Thrissur",
      city: "Thrissur",
      registrationNumber: "COL-KL-TCR-002",
      contactPerson: {
        name: "Dr. Latha Menon",
        designation: "NCC Officer",
        phone: "9447890124",
      },
      established: new Date("1889-10-01"),
      description:
        "Historic autonomous college with active blood donation culture. Organizes camps in association with District Blood Bank.",
      isVerified: true,
    },
    {
      name: "Kerala Institute of Medical Sciences College",
      type: "college",
      email: "admin@kims.edu.in",
      password: hashedPassword,
      phone: "9447901234",
      address: "Ollur, Thrissur",
      city: "Thrissur",
      registrationNumber: "COL-KL-TCR-003",
      contactPerson: {
        name: "Dr. Anita Raj",
        designation: "Dean of Students",
        phone: "9447901235",
      },
      established: new Date("2002-07-15"),
      description:
        "Medical college with strong focus on community healthcare. Student volunteers organize monthly blood donation drives.",
      isVerified: false, // Pending verification
    },
    {
      name: "Sree Kerala Varma College",
      type: "college",
      email: "nss@skvthrissur.ac.in",
      password: hashedPassword,
      phone: "9448012345",
      address: "Kuruppam Road, Thrissur",
      city: "Thrissur",
      registrationNumber: "COL-KL-TCR-004",
      contactPerson: {
        name: "Prof. Deepak Kumar",
        designation: "NSS Coordinator",
        phone: "9448012346",
      },
      established: new Date("1866-11-01"),
      description:
        "One of the oldest colleges in Kerala. NSS volunteers actively participate in blood donation and awareness campaigns.",
      isVerified: true,
    },

    // Organizations from nearby cities
    {
      name: "Ernakulam Medical Trust Hospital",
      type: "hospital",
      email: "blooddonation@medicaltrust.org",
      password: hashedPassword,
      phone: "9448123456",
      address: "M.G. Road, Ernakulam",
      city: "Ernakulam",
      registrationNumber: "HOSP-KL-EKM-001",
      contactPerson: {
        name: "Dr. Vineeth Kumar",
        designation: "Blood Bank In-charge",
        phone: "9448123457",
      },
      established: new Date("1974-03-15"),
      description:
        "Leading private hospital in Ernakulam conducting regular blood donation camps.",
      isVerified: true,
    },
    {
      name: "Palakkad Youth Blood Donors Forum",
      type: "ngo",
      email: "palakkad@youthblood.org",
      password: hashedPassword,
      phone: "9448234567",
      address: "Gandhi Nagar, Palakkad",
      city: "Palakkad",
      registrationNumber: "NGO-KL-PKD-001",
      contactPerson: {
        name: "Arun Menon",
        designation: "Founder",
        phone: "9448234568",
      },
      established: new Date("2012-09-05"),
      description:
        "Youth-led initiative promoting blood donation in Palakkad district.",
      isVerified: true,
    },
  ];

  const createdOrganizations = await Organization.insertMany(organizations);
  console.log(`✅ Created ${createdOrganizations.length} organizations`);

  // VERIFY all phone numbers are 10 digits
  let phoneErrors = 0;
  createdOrganizations.forEach((org) => {
    if (org.phone.length !== 10) {
      console.error(
        `❌ Organization ${org.name} has invalid phone: ${org.phone} (${org.phone.length} digits)`
      );
      phoneErrors++;
    }
    if (org.contactPerson.phone.length !== 10) {
      console.error(
        `❌ Organization ${org.name} contact person has invalid phone: ${org.contactPerson.phone} (${org.contactPerson.phone.length} digits)`
      );
      phoneErrors++;
    }
  });

  if (phoneErrors === 0) {
    console.log("✅ All organization phone numbers verified: 10 digits");
  } else {
    console.error(`❌ Found ${phoneErrors} invalid phone numbers!`);
  }

  return createdOrganizations;
};

// Create Requests
const createRequests = async (users, bloodBanks) => {
  const requests = [];

  // Get only regular users (not admin)
  const regularUsers = users.filter((user) => user.role !== "admin");
  const approvedBloodBanks = bloodBanks.filter((bank) => bank.isApproved);

  // Kerala hospitals
  const hospitals = [
    "Jubilee Mission Hospital, Thrissur",
    "Amala Institute of Medical Sciences, Thrissur",
    "Lissie Hospital, Ernakulam",
    "Government Medical College, Thrissur",
    "KIMS Hospital, Ernakulam",
    "Mother Hospital, Thrissur",
    "Elite Mission Hospital, Thrissur",
    "Medical Trust Hospital, Ernakulam",
    "Baby Memorial Hospital, Kozhikode",
    "Westfort Hi-Tech Hospital, Thrissur",
  ];

  // Create 20 requests from users
  for (let i = 0; i < 20; i++) {
    const randomUser =
      regularUsers[Math.floor(Math.random() * regularUsers.length)];
    const randomBloodType =
      bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
    const randomUrgency =
      urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];
    const randomStatus =
      Math.random() > 0.7
        ? "fulfilled"
        : Math.random() > 0.5
        ? "pending"
        : "cancelled";
    const randomHospital =
      hospitals[Math.floor(Math.random() * hospitals.length)];

    requests.push({
      bloodType: randomBloodType,
      quantity: Math.floor(Math.random() * 5) + 1, // 1-5 units
      urgency: randomUrgency,
      city: randomUser.city,
      hospital: randomHospital,
      patientName: generateName(),
      contactNumber: generatePhone(),
      reason: `Medical emergency requiring ${randomBloodType} blood transfusion. Patient admitted in ICU.`,
      requestedBy: randomUser._id,
      requesterModel: "User",
      status: randomStatus,
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ),
    });
  }

  // Create 8 requests from blood banks
  for (let i = 0; i < 8; i++) {
    const randomBloodBank =
      approvedBloodBanks[Math.floor(Math.random() * approvedBloodBanks.length)];
    const randomBloodType =
      bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
    const randomUrgency =
      urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];

    requests.push({
      bloodType: randomBloodType,
      quantity: Math.floor(Math.random() * 15) + 5,
      urgency: randomUrgency,
      city: randomBloodBank.city,
      hospital: randomBloodBank.name,
      patientName: `Blood Bank Stock Request ${i + 1}`,
      contactNumber: randomBloodBank.phone,
      reason: `Urgent requirement: Blood bank inventory running low on ${randomBloodType}. Multiple patients waiting.`,
      requestedBy: randomBloodBank._id,
      requesterModel: "BloodBank",
      status: "pending",
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    });
  }

  const createdRequests = await Request.insertMany(requests);
  console.log(`✅ Created ${createdRequests.length} requests`);

  // Add some responses to requests
  for (let i = 0; i < 15; i++) {
    const randomRequest =
      createdRequests[Math.floor(Math.random() * createdRequests.length)];
    const randomResponder =
      regularUsers[Math.floor(Math.random() * regularUsers.length)];

    if (randomRequest.responses.length < 3) {
      randomRequest.responses.push({
        responderId: randomResponder._id,
        responderModel: "User",
        message: `I can donate ${randomRequest.bloodType} blood. I'm available in ${randomResponder.city}. Please contact me at ${randomResponder.phone}. Ready to help immediately.`,
        createdAt: new Date(),
      });
      await randomRequest.save();
    }
  }
  console.log("✅ Added responses to requests");

  return createdRequests;
};

// Create Donation History
const createDonationHistory = async (users, bloodBanks, camps) => {
  const donationHistories = [];
  const locations = [
    "City Blood Bank",
    "Red Cross Blood Center",
    "Community Health Center",
    "District Hospital Blood Bank",
    "Medical College Blood Bank",
    "Voluntary Blood Donation Camp",
    "Corporate Blood Donation Drive",
    "College Blood Donation Camp",
  ];

  // Create donation history for each user (3-8 donations per active user)
  for (const user of users) {
    // Skip admin and some users (to have variety)
    if (user.role === "admin" || Math.random() > 0.7) continue;

    const numDonations = Math.floor(Math.random() * 6) + 3; // 3-8 donations

    for (let i = 0; i < numDonations; i++) {
      // Random date in the past 2 years
      const daysAgo = Math.floor(Math.random() * 730); // Up to 2 years ago
      const donationDate = new Date();
      donationDate.setDate(donationDate.getDate() - daysAgo);

      // Ensure donations are at least 56 days apart (blood donation rules)
      const minDaysBetween = 56;
      if (i > 0) {
        const previousDate = new Date(
          donationHistories[donationHistories.length - 1].date
        );
        const daysDiff = Math.floor(
          (donationDate - previousDate) / (1000 * 60 * 60 * 24)
        );
        if (Math.abs(daysDiff) < minDaysBetween) {
          donationDate.setDate(
            previousDate.getDate() -
              minDaysBetween -
              Math.floor(Math.random() * 30)
          );
        }
      }

      const randomLocation =
        locations[Math.floor(Math.random() * locations.length)];
      const randomBloodBank =
        bloodBanks[Math.floor(Math.random() * bloodBanks.length)];
      const randomCamp =
        camps && camps.length > 0
          ? camps[Math.floor(Math.random() * camps.length)]
          : null;

      const notes = [
        "Smooth donation experience",
        "Quick and efficient process",
        "Staff was very professional",
        "Happy to help save lives",
        "Regular donor, great facility",
        "First time donation, went well",
        "Emergency donation for friend",
        "Participated in blood donation drive",
      ];

      donationHistories.push({
        userId: user._id,
        location: `${randomLocation}, ${user.city}`,
        date: donationDate,
        quantity: [350, 450, 500][Math.floor(Math.random() * 3)],
        bloodType: user.bloodType,
        status: "completed",
        notes: notes[Math.floor(Math.random() * notes.length)],
        bloodBankId: Math.random() > 0.5 ? randomBloodBank._id : undefined,
        campId: randomCamp && Math.random() > 0.7 ? randomCamp._id : undefined,
      });
    }
  }

  // Sort by date to maintain chronological order
  donationHistories.sort((a, b) => a.date - b.date);

  const createdDonations = await DonationHistory.insertMany(donationHistories);
  console.log(`✅ Created ${createdDonations.length} donation history records`);

  // Calculate some stats
  const totalBloodDonated = createdDonations.reduce(
    (sum, d) => sum + d.quantity,
    0
  );
  const livesSaved = createdDonations.length * 3;
  console.log(
    `   📊 Total blood donated: ${totalBloodDonated}ml (~${(
      totalBloodDonated / 1000
    ).toFixed(1)} liters)`
  );
  console.log(`   💝 Estimated lives saved: ${livesSaved}`);

  return createdDonations;
};

// Create Blood Camps
const createBloodCamps = async (organizations, bloodBanks) => {
  const camps = [];
  const verifiedOrgs = organizations.filter((org) => org.isVerified);

  const campTitles = [
    "Blood Donation Camp",
    "Life Saving Blood Drive",
    "Community Blood Collection",
    "Emergency Blood Donation",
    "Voluntary Blood Donation Drive",
    "Save Lives Blood Camp",
  ];

  const venues = [
    "Community Hall",
    "College Auditorium",
    "Hospital Main Block",
    "NGO Center",
    "Sports Complex",
    "Convention Center",
  ];

  // First, create ONGOING camps (today's date - October 20, 2025)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log(
    `   Creating camps for TODAY (${today.toDateString()}) to test ONGOING status...`
  );

  // Create 3-5 ongoing camps from different organizations for TODAY
  const numOngoingCamps = Math.floor(Math.random() * 3) + 3; // 3-5 camps
  for (let i = 0; i < numOngoingCamps && i < verifiedOrgs.length; i++) {
    const org = verifiedOrgs[i];
    const randomVenue = venues[Math.floor(Math.random() * venues.length)];
    const randomTitle =
      campTitles[Math.floor(Math.random() * campTitles.length)];

    camps.push({
      title: `${randomTitle} - ${org.name} [ONGOING TODAY]`,
      organizer: org._id,
      date: new Date(today), // Today's date
      startTime: ["08:00", "09:00"][Math.floor(Math.random() * 2)],
      endTime: ["16:00", "17:00", "18:00"][Math.floor(Math.random() * 3)],
      venue: `${randomVenue}, ${org.city}`,
      city: org.city,
      address: org.address,
      contactPerson: {
        name: org.contactPerson.name,
        phone: org.contactPerson.phone,
        email: org.email,
      },
      expectedDonors: Math.floor(Math.random() * 100) + 50,
      registeredDonors: [],
      description: `Join us TODAY for a ${randomTitle.toLowerCase()} organized by ${
        org.name
      }. Every donation can save up to 3 lives. Walk-ins welcome! Camp is ONGOING right now!`,
      requirements: `Age: 18-65 years, Weight: Minimum 50 kg, No recent illness or medication, Bring valid ID proof, Have a light meal before donation`,
      facilities: [
        "Refreshments provided",
        "Medical team on-site",
        "Free health checkup",
        "Parking available",
      ],
      isApproved: true,
    });
  }

  // Second, create camps for TOMORROW (October 21, 2025) 9 AM - 4 PM
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  console.log(
    `   Creating camps for TOMORROW (${tomorrow.toDateString()}) 9 AM - 4 PM...`
  );

  // Create 3-4 camps for tomorrow from different organizations
  const numTomorrowCamps = Math.floor(Math.random() * 2) + 3; // 3-4 camps
  const tomorrowOrgStartIndex = numOngoingCamps; // Continue from where we left off
  for (
    let i = 0;
    i < numTomorrowCamps && tomorrowOrgStartIndex + i < verifiedOrgs.length;
    i++
  ) {
    const org = verifiedOrgs[tomorrowOrgStartIndex + i];
    const randomVenue = venues[Math.floor(Math.random() * venues.length)];
    const randomTitle =
      campTitles[Math.floor(Math.random() * campTitles.length)];

    camps.push({
      title: `${randomTitle} - ${org.name} [TOMORROW 9AM-4PM]`,
      organizer: org._id,
      date: new Date(tomorrow), // Tomorrow's date
      startTime: "09:00", // 9 AM
      endTime: "16:00", // 4 PM
      venue: `${randomVenue}, ${org.city}`,
      city: org.city,
      address: org.address,
      contactPerson: {
        name: org.contactPerson.name,
        phone: org.contactPerson.phone,
        email: org.email,
      },
      expectedDonors: Math.floor(Math.random() * 100) + 50,
      registeredDonors: [],
      description: `Join us TOMORROW (${tomorrow.toDateString()}) from 9 AM to 4 PM for a ${randomTitle.toLowerCase()} organized by ${
        org.name
      }. Every donation can save up to 3 lives. Register now!`,
      requirements: `Age: 18-65 years, Weight: Minimum 50 kg, No recent illness or medication, Bring valid ID proof, Have a light meal before donation`,
      facilities: [
        "Refreshments provided",
        "Medical team on-site",
        "Free health checkup",
        "Parking available",
        "AC venue",
      ],
      isApproved: true,
    });
  }

  // Create camps for verified organizations with various dates
  for (const org of verifiedOrgs) {
    const numCamps = Math.floor(Math.random() * 3) + 2; // 2-4 camps per org

    for (let i = 0; i < numCamps; i++) {
      // Create camps with various dates - including past, today, and future
      // This will allow testing of all camp statuses
      const daysOffset = Math.floor(Math.random() * 120) - 30; // -30 to +90 days
      const campDate = new Date();
      campDate.setDate(campDate.getDate() + daysOffset);

      // Don't set status here - let the model's updateStatus() method handle it dynamically
      // Status will be automatically determined based on the date

      const randomVenue = venues[Math.floor(Math.random() * venues.length)];
      const randomTitle =
        campTitles[Math.floor(Math.random() * campTitles.length)];

      camps.push({
        title: `${randomTitle} - ${org.name}`,
        organizer: org._id,
        date: campDate,
        startTime: ["09:00", "10:00", "08:00"][Math.floor(Math.random() * 3)],
        endTime: ["16:00", "17:00", "18:00"][Math.floor(Math.random() * 3)],
        venue: `${randomVenue}, ${org.city}`,
        city: org.city,
        address: org.address,
        contactPerson: {
          name: org.contactPerson.name,
          phone: org.contactPerson.phone,
          email: org.email,
        },
        expectedDonors: Math.floor(Math.random() * 100) + 50,
        registeredDonors: [], // Will be empty array for now
        // Don't set status - it will default to "upcoming" and be updated dynamically
        description: `Join us for a ${randomTitle.toLowerCase()} organized by ${
          org.name
        }. Every donation can save up to 3 lives. Walk-ins welcome!`,
        requirements: `Age: 18-65 years, Weight: Minimum 50 kg, No recent illness or medication, Bring valid ID proof, Have a light meal before donation`,
        facilities: [
          "Refreshments provided",
          "Medical team on-site",
          "Free health checkup",
        ],
        isApproved: true,
      });
    }
  }

  const createdCamps = await BloodCamp.insertMany(camps);
  console.log(`✅ Created ${createdCamps.length} blood camps`);

  // Count camps by date to show distribution
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const ongoingCount = createdCamps.filter((c) => {
    const campDate = new Date(c.date);
    campDate.setHours(0, 0, 0, 0);
    return campDate.getTime() === todayDate.getTime();
  }).length;

  const tomorrowCount = createdCamps.filter((c) => {
    const campDate = new Date(c.date);
    campDate.setHours(0, 0, 0, 0);
    return campDate.getTime() === tomorrowDate.getTime();
  }).length;

  const upcomingCount = createdCamps.filter((c) => {
    const campDate = new Date(c.date);
    campDate.setHours(0, 0, 0, 0);
    return campDate.getTime() > tomorrowDate.getTime();
  }).length;

  const completedCount = createdCamps.filter((c) => {
    const campDate = new Date(c.date);
    campDate.setHours(0, 0, 0, 0);
    return campDate.getTime() < todayDate.getTime();
  }).length;

  console.log(`   📅 Ongoing (Today - Oct 20): ${ongoingCount} camps`);
  console.log(`   📅 Tomorrow (Oct 21, 9AM-4PM): ${tomorrowCount} camps`);
  console.log(`   📅 Upcoming (Future): ${upcomingCount} camps`);
  console.log(`   📅 Completed (Past): ${completedCount} camps`);

  return createdCamps;
};

// Seed Database
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await BloodBank.deleteMany({});
    await Request.deleteMany({});
    await Organization.deleteMany({});
    await BloodCamp.deleteMany({});
    await DonationHistory.deleteMany({});
    console.log("✅ Cleared existing data");

    // Create new data
    console.log("📝 Creating new data for Kerala region...");

    console.log("\n👥 Creating Users...");
    const users = await createUsers();

    console.log("\n🏥 Creating Blood Banks...");
    const bloodBanks = await createBloodBanks();

    console.log("\n🏢 Creating Organizations...");
    const organizations = await createOrganizations();

    console.log("\n⛺ Creating Blood Camps...");
    const camps = await createBloodCamps(organizations, bloodBanks);

    console.log("\n📋 Creating Requests...");
    const requests = await createRequests(users, bloodBanks);

    console.log("\n💉 Creating Donation History...");
    const donations = await createDonationHistory(users, bloodBanks, camps);

    console.log("\n🎉 Database seeded successfully with Kerala data!");
    console.log("\n📊 Summary:");
    console.log(
      `   - Users: ${users.length} (Focus: Thrissur & Central Kerala)`
    );
    console.log(
      `   - Blood Banks: ${bloodBanks.length} (Major Kerala hospitals)`
    );
    console.log(
      `   - Organizations: ${organizations.length} (Hospitals: ${
        organizations.filter((o) => o.type === "hospital").length
      }, NGOs: ${
        organizations.filter((o) => o.type === "ngo").length
      }, Colleges: ${organizations.filter((o) => o.type === "college").length})`
    );
    console.log(
      `   - Verified Organizations: ${
        organizations.filter((o) => o.isVerified).length
      } | Pending: ${organizations.filter((o) => !o.isVerified).length}`
    );
    console.log(`   - Blood Camps: ${camps.length}`);
    console.log(`   - Blood Requests: ${requests.length}`);
    console.log(`   - Donation Records: ${donations.length}`);
    console.log("\n✅ ALL PHONE NUMBERS VERIFIED: Exactly 10 digits");
    console.log("\n👤 Login Credentials:");
    console.log("\n   🔐 Admin (Thrissur):");
    console.log("   Email: admin@bloodlife.com");
    console.log("   Password: password123");
    console.log("   Phone: 9876543210");
    console.log("\n   👨‍💼 Regular User (Thrissur):");
    console.log("   Email: arun.menon@example.com");
    console.log("   Password: password123");
    console.log("\n   🏥 Blood Bank (Thrissur):");
    console.log("   Email: contact@thrissurbloodbank.com");
    console.log("   Password: bloodbank123");
    console.log("\n   🏢 Organization - Hospital (Verified):");
    console.log("   Email: admin@jubileemission.org");
    console.log("   Password: organization123");
    console.log("\n   🤝 Organization - NGO (Verified):");
    console.log("   Email: contact@thrissurblooddonors.org");
    console.log("   Password: organization123");
    console.log("\n   🎓 Organization - College (Verified):");
    console.log("   Email: nss@gectcr.ac.in");
    console.log("   Password: organization123");
    console.log("\n   📝 All users password: password123");
    console.log("   📝 All blood banks password: bloodbank123");
    console.log("   📝 All organizations password: organization123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
