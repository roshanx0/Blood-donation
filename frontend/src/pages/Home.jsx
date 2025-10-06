import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Droplet,
  Heart,
  Users,
  Building2,
  Shield,
  Search,
  MapPin,
  TrendingUp,
  Phone,
  Mail,
  ArrowRight,
  Activity,
  Award,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Card from "../components/Card";

const Home = () => {
  const [selectedBloodType, setSelectedBloodType] = useState("A+");

  const bloodCompatibility = {
    "O-": {
      donates: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
      receives: ["O-"],
    },
    "O+": { donates: ["O+", "A+", "B+", "AB+"], receives: ["O-", "O+"] },
    "A-": { donates: ["A-", "A+", "AB-", "AB+"], receives: ["O-", "A-"] },
    "A+": { donates: ["A+", "AB+"], receives: ["O-", "O+", "A-", "A+"] },
    "B-": { donates: ["B-", "B+", "AB-", "AB+"], receives: ["O-", "B-"] },
    "B+": { donates: ["B+", "AB+"], receives: ["O-", "O+", "B-", "B+"] },
    "AB-": { donates: ["AB-", "AB+"], receives: ["O-", "A-", "B-", "AB-"] },
    "AB+": {
      donates: ["AB+"],
      receives: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    },
  };

  const stats = [
    {
      icon: <Users className="h-6 w-6" />,
      count: "10,000+",
      label: "Active Donors",
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      count: "500+",
      label: "Blood Banks",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      count: "25,000+",
      label: "Lives Saved",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      count: "98%",
      label: "Success Rate",
    },
  ];

  const services = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Find Blood Banks",
      description: "Search blood banks with real-time inventory across Kerala",
      link: "/blood-banks",
    },
    {
      icon: <Droplet className="h-8 w-8" />,
      title: "Request Blood",
      description:
        "Create urgent requests and notify matching donors instantly",
      link: "/requests/create",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Register as Donor",
      description: "Join our community and help save lives in your city",
      link: "/register/user",
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Blood Bank Portal",
      description: "Manage inventory and connect with donors efficiently",
      link: "/register/bloodbank",
    },
  ];

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Verified Network",
      description: "All blood banks and donors are verified for your safety",
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Real-Time Updates",
      description: "Live blood inventory and instant request notifications",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location Based",
      description: "Find donors and blood banks in your local area",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Easy Process",
      description: "Simple registration and request management system",
    },
  ];

  const process = [
    {
      number: "1",
      title: "Register",
      description: "Sign up with your details",
    },
    {
      number: "2",
      title: "Get Verified",
      description: "Complete your profile",
    },
    {
      number: "3",
      title: "Save Lives",
      description: "Donate or request blood",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Save Lives Through
              <span className="block text-red-100 mt-2">Blood Donation</span>
            </h1>

            <p className="text-lg lg:text-xl text-red-50 mb-8 leading-relaxed">
              Kerala's trusted platform connecting blood donors with those in
              need. Every donation saves up to 3 lives.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register/user"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 rounded-xl font-semibold text-lg hover:bg-red-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Register as Donor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                to="/blood-banks"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
              >
                <Search className="mr-2 h-5 w-5" />
                Find Blood Banks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 text-red-600 rounded-xl mb-4 shadow-sm">
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.count}
                </div>
                <div className="text-sm text-gray-700 font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How Can We Help You?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Whether you want to donate or need blood, we make it simple and
              efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link key={index} to={service.link}>
                <Card className="h-full transition-all group">
                  <div className="text-red-600 mb-4 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {service.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple Process
            </h2>
            <p className="text-lg text-gray-700">
              Get started in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl text-2xl font-bold mb-4 shadow-md">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-700 font-medium">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BloodLife?
            </h2>
            <p className="text-lg text-gray-700">
              Trusted by thousands across Kerala
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 text-red-600 rounded-xl mb-4 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blood Compatibility Checker */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Blood Type Compatibility
            </h2>
            <p className="text-gray-700">
              Select your blood type to see compatibility
            </p>
          </div>

          <Card className="bg-white">
            {/* Blood Type Selector */}
            <div className="mb-6">
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {Object.keys(bloodCompatibility).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedBloodType(type)}
                    className={`py-3 px-2 rounded-lg border font-bold text-lg transition-all ${
                      selectedBloodType === type
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-red-400"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Compatibility Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              {/* Can Donate To */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">
                  Can Donate To (
                  {bloodCompatibility[selectedBloodType].donates.length})
                </h3>

                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(bloodCompatibility).map((type) => (
                    <div
                      key={type}
                      className={`py-2 px-1 rounded text-center font-semibold text-sm transition-all ${
                        bloodCompatibility[selectedBloodType].donates.includes(
                          type
                        )
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-300"
                      }`}
                    >
                      {type}
                    </div>
                  ))}
                </div>

                {selectedBloodType === "O-" && (
                  <div className="mt-3 text-xs text-green-700 bg-green-50 px-3 py-2 rounded border border-green-200">
                    ✓ Universal Donor
                  </div>
                )}
              </div>

              {/* Can Receive From */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">
                  Can Receive From (
                  {bloodCompatibility[selectedBloodType].receives.length})
                </h3>

                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(bloodCompatibility).map((type) => (
                    <div
                      key={type}
                      className={`py-2 px-1 rounded text-center font-semibold text-sm transition-all ${
                        bloodCompatibility[selectedBloodType].receives.includes(
                          type
                        )
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-300"
                      }`}
                    >
                      {type}
                    </div>
                  ))}
                </div>

                {selectedBloodType === "AB+" && (
                  <div className="mt-3 text-xs text-green-700 bg-green-50 px-3 py-2 rounded border border-green-200">
                    ✓ Universal Receiver
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Donation Impact */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-12 lg:p-16 text-white text-center shadow-xl">
            <Heart className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              One Donation Saves
            </h2>
            <div className="text-7xl lg:text-8xl font-bold mb-4">3</div>
            <p className="text-2xl lg:text-3xl text-red-100 mb-8">Lives</p>
            <p className="text-lg text-red-50 mb-8 max-w-2xl mx-auto leading-relaxed">
              Every blood donation has the potential to save up to three lives.
              Your contribution makes a real difference.
            </p>
            <Link
              to="/register/user"
              className="inline-flex items-center px-8 py-4 bg-white text-red-600 rounded-xl font-semibold text-lg hover:bg-red-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Start Saving Lives Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Eligibility Quick Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Can You Donate?
            </h2>
            <p className="text-lg text-gray-700">
              Basic eligibility requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-green-50 border-green-300">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-green-700 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    Required
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-800 font-medium">
                    <li>• Age: 18-65 years</li>
                    <li>• Weight: Minimum 50 kg</li>
                    <li>• Good health condition</li>
                    <li>• Hemoglobin: 12.5 g/dL minimum</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bg-red-50 border-red-300">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-red-700 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    Not Eligible If
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-800 font-medium">
                    <li>• Pregnant or breastfeeding</li>
                    <li>• Recent illness or surgery</li>
                    <li>• Certain medications</li>
                    <li>• Recent tattoo (wait 3 months)</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/eligibility"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
            >
              <span>Check Full Eligibility Criteria</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full mb-4">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-semibold">
                    24/7 Emergency Support
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Need Blood Urgently?
                </h2>
                <p className="text-lg text-red-100">
                  Our emergency team is available round the clock to help you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="tel:+919876543210"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-6 transition-all text-white"
                >
                  <Phone className="h-8 w-8 mb-3" />
                  <div className="text-sm text-red-100 mb-1">
                    Emergency Hotline
                  </div>
                  <div className="text-xl font-bold">+91 9876543210</div>
                </a>

                <a
                  href="mailto:emergency@bloodlife.com"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-6 transition-all text-white"
                >
                  <Mail className="h-8 w-8 mb-3" />
                  <div className="text-sm text-red-100 mb-1">Email Support</div>
                  <div className="text-lg font-bold break-all">
                    emergency@bloodlife.com
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Droplet className="h-16 w-16 text-red-600 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-700 mb-8 font-medium">
            Join thousands of donors saving lives across Kerala
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register/user"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Register Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/requests"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 border-2 border-red-600 rounded-lg font-semibold text-lg hover:bg-red-50 transition-all shadow-md hover:shadow-lg"
            >
              View Blood Requests
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
