import { Link } from "react-router-dom";
import { Droplet, Heart, Phone, Mail, MapPin, Smartphone } from "lucide-react";
import QRCode from "react-qr-code";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-2.5 rounded-xl shadow-sm">
                <Droplet className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">BloodLife</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting donors and recipients, saving lives one donation at a
              time.
            </p>
            <div className="flex items-center space-x-2 text-red-400">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-medium">Every drop counts</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/requests"
                  className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                >
                  Blood Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/blood-banks"
                  className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                >
                  Blood Banks
                </Link>
              </li>
              <li>
                <Link
                  to="/register/user"
                  className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                >
                  Register as Donor
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Organizations</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/register/bloodbank"
                  className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                >
                  Register Blood Bank
                </Link>
              </li>
              <li>
                <Link
                  to="/login/bloodbank"
                  className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                >
                  Blood Bank Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2.5 text-gray-400 text-sm">
                <Phone className="h-4 w-4 text-red-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2.5 text-gray-400 text-sm">
                <Mail className="h-4 w-4 text-red-400" />
                <span>support@bloodlife.com</span>
              </li>
              <li className="flex items-start space-x-2.5 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 text-red-400 mt-1" />
                <span>
                  123 Healthcare Ave, Medical District, City, State 12345
                </span>
              </li>
            </ul>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <QRCode
                value="https://blood-donation-two-gold.vercel.app/"
                size={120}
                level="H"
                className="w-full h-auto"
              />
            </div>
            <div className="mt-3 text-center md:text-left">
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="h-4 w-4 text-red-400" />
                <p className="text-sm font-semibold text-gray-300">
                  Scan QR Code
                </p>
              </div>
              <p className="text-xs text-gray-500">Access on mobile</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} BloodLife. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-red-400 transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-red-400 transition-colors text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
