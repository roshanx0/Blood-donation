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
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 dark:from-red-800 dark:via-red-900 dark:to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Save Lives Through
              <span className="block text-red-200">Blood Donation</span>
            </h1>

            <p className="text-xl lg:text-2xl text-red-100 mb-8 leading-relaxed">
              Kerala's trusted platform connecting blood donors with those in
              need. Every donation saves up to 3 lives.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register/user"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 rounded-lg font-semibold text-lg hover:bg-red-50 transition-all shadow-lg hover:shadow-xl"
              >
                Register as Donor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                to="/blood-banks"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-all"
              >
                <Search className="mr-2 h-5 w-5" />
                Find Blood Banks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How Can We Help You?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Whether you want to donate or need blood, we make it simple and
              efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link key={index} to={service.link}>
                <Card className="h-full hover:shadow-lg transition-all group">
                  <div className="text-red-600 dark:text-red-400 mb-4 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple Process
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Get started in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 text-white rounded-full text-2xl font-bold mb-4 shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose BloodLife?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Trusted by thousands across Kerala
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Impact */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-900 rounded-2xl p-12 lg:p-16 text-white text-center">
            <Heart className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              One Donation Saves
            </h2>
            <div className="text-7xl lg:text-8xl font-bold mb-4">3</div>
            <p className="text-2xl lg:text-3xl text-red-100 mb-8">Lives</p>
            <p className="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
              Every blood donation has the potential to save up to three lives.
              Your contribution makes a real difference.
            </p>
            <Link
              to="/register/user"
              className="inline-flex items-center px-8 py-4 bg-white text-red-600 rounded-lg font-semibold text-lg hover:bg-red-50 transition-all"
            >
              Start Saving Lives Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Eligibility Quick Info */}
      <section className="py-20 bg-gray-50 dark:bg-dark-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Can You Donate?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Basic eligibility requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Required
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Age: 18-65 years</li>
                    <li>• Weight: Minimum 50 kg</li>
                    <li>• Good health condition</li>
                    <li>• Hemoglobin: 12.5 g/dL minimum</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Not Eligible If
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
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
              to="/register/user"
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold"
            >
              Check Full Eligibility Criteria →
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-900 rounded-2xl p-8 lg:p-12">
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
      <section className="py-20 bg-gray-50 dark:bg-dark-950">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Droplet className="h-16 w-16 text-red-600 dark:text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of donors saving lives across Kerala
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register/user"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
            >
              Register Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/requests"
              className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-dark-800 text-red-600 dark:text-red-400 border-2 border-red-600 dark:border-red-500 rounded-lg font-semibold text-lg hover:bg-red-50 dark:hover:bg-dark-700 transition-all"
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
