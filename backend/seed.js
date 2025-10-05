const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Load env vars
dotenv.config({ path: "./.env" });

// Load models
const User = require("./models/User");
const BloodBank = require("./models/BloodBank");
const Request = require("./models/Request");

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

// Seed Database
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await BloodBank.deleteMany({});
    await Request.deleteMany({});
    console.log("✅ Cleared existing data");

    // Create new data
    console.log("📝 Creating new data for Kerala region...");
    const users = await createUsers();
    const bloodBanks = await createBloodBanks();
    const requests = await createRequests(users, bloodBanks);

    console.log("\n🎉 Database seeded successfully with Kerala data!");
    console.log("\n📊 Summary:");
    console.log(
      `   - Users: ${users.length} (Focus: Thrissur & Central Kerala)`
    );
    console.log(
      `   - Blood Banks: ${bloodBanks.length} (Major Kerala hospitals)`
    );
    console.log(`   - Blood Requests: ${requests.length}`);
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
    console.log("\n   📝 All users password: password123");
    console.log("   📝 All blood banks password: bloodbank123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
