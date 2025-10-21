import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import Card from "../components/Card";
import Loader from "../components/Loader";
import DashboardLayout from "../components/DashboardLayout";
import {
  Calendar,
  MapPin,
  Droplet,
  Award,
  TrendingUp,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";

const DonationHistory = () => {
  const { user } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/auth/donation-history");
      setDonations(data.donations || []);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("Failed to load donation history");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const totalDonations = donations.length;
  const totalBloodDonated = donations.reduce((sum, d) => sum + d.quantity, 0);
  const livesSaved = totalDonations * 3;

  // Get achievement badge
  const getAchievementBadge = () => {
    if (totalDonations >= 10)
      return { text: "Hero Donor", color: "text-yellow-600", icon: "🏆" };
    if (totalDonations >= 5)
      return { text: "Regular Donor", color: "text-blue-600", icon: "⭐" };
    if (totalDonations >= 3)
      return { text: "Active Donor", color: "text-green-600", icon: "🎖️" };
    return { text: "New Donor", color: "text-gray-600", icon: "👍" };
  };

  const badge = getAchievementBadge();

  // Generate and download certificate
  const downloadCertificate = (donation) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
    gradient.addColorStop(0, "#FEE2E2");
    gradient.addColorStop(1, "#FECACA");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 800);

    // Border
    ctx.strokeStyle = "#DC2626";
    ctx.lineWidth = 10;
    ctx.strokeRect(30, 30, 1140, 740);

    // Inner border
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 1100, 700);

    // Title
    ctx.fillStyle = "#991B1B";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("CERTIFICATE OF APPRECIATION", 600, 150);

    // Subtitle
    ctx.font = "italic 28px Arial";
    ctx.fillStyle = "#B91C1C";
    ctx.fillText("Blood Donation Certificate", 600, 200);

    // Red cross symbol
    ctx.fillStyle = "#DC2626";
    ctx.fillRect(570, 230, 20, 60);
    ctx.fillRect(550, 250, 60, 20);

    // Main text
    ctx.font = "24px Arial";
    ctx.fillStyle = "#374151";
    ctx.fillText("This is to certify that", 600, 330);

    // Donor name
    ctx.font = "bold 42px Arial";
    ctx.fillStyle = "#1F2937";
    ctx.fillText(user.name.toUpperCase(), 600, 390);

    // Details
    ctx.font = "24px Arial";
    ctx.fillStyle = "#374151";
    ctx.fillText("has donated blood on", 600, 450);

    // Date
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#DC2626";
    const donationDate = new Date(donation.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    ctx.fillText(donationDate, 600, 500);

    // Location
    ctx.font = "22px Arial";
    ctx.fillStyle = "#6B7280";
    ctx.fillText(`at ${donation.location}`, 600, 540);

    // Blood type and quantity
    ctx.font = "bold 26px Arial";
    ctx.fillStyle = "#991B1B";
    ctx.fillText(
      `Blood Type: ${donation.bloodType} | Quantity: ${donation.quantity}ml`,
      600,
      590
    );

    // Appreciation message
    ctx.font = "italic 20px Arial";
    ctx.fillStyle = "#4B5563";
    ctx.fillText("Your generous donation can save up to 3 lives", 600, 640);

    // Footer
    ctx.font = "18px Arial";
    ctx.fillStyle = "#6B7280";
    ctx.fillText("Thank you for being a life saver!", 600, 680);

    // Signature line
    ctx.strokeStyle = "#9CA3AF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(800, 720);
    ctx.lineTo(1000, 720);
    ctx.stroke();

    ctx.font = "16px Arial";
    ctx.fillStyle = "#6B7280";
    ctx.fillText("Authorized Signature", 900, 740);

    // Convert to image and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `Blood_Donation_Certificate_${user.name.replace(
        /\s+/g,
        "_"
      )}_${new Date(donation.date).toISOString().split("T")[0]}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Certificate downloaded successfully!");
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout activeTab="donation-history" userType="user">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="donation-history" userType="user">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Donation History
            </h1>
            <p className="text-gray-600 mt-1">
              Track your blood donation journey. Donations are recorded by blood banks and camp organizers.
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card gradient className="text-center">
            <Droplet className="h-10 w-10 text-red-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900">
              {totalDonations}
            </div>
            <div className="text-sm text-gray-600">Total Donations</div>
          </Card>

          <Card gradient className="text-center">
            <TrendingUp className="h-10 w-10 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900">
              {(totalBloodDonated / 1000).toFixed(1)}L
            </div>
            <div className="text-sm text-gray-600">Blood Donated</div>
          </Card>

          <Card gradient className="text-center">
            <div className="text-4xl mb-2">❤️</div>
            <div className="text-3xl font-bold text-gray-900">{livesSaved}</div>
            <div className="text-sm text-gray-600">Lives Saved</div>
          </Card>

          <Card gradient className="text-center">
            <Award className="h-10 w-10 text-yellow-600 mx-auto mb-3" />
            <div className={`text-xl font-bold ${badge.color}`}>
              {badge.icon} {badge.text}
            </div>
            <div className="text-sm text-gray-600 mt-1">Achievement</div>
          </Card>
        </div>

        {/* Donation List */}
        {donations.length === 0 ? (
          <Card className="text-center py-12">
            <Droplet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Donations Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Your donations will be recorded here when you donate at blood banks or camps
            </p>
            <p className="text-sm text-gray-400">
              Visit a blood bank or register for a blood camp to start your life-saving journey!
            </p>
          </Card>
        ) : (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Donation Records
            </h2>
            <div className="space-y-4">
              {donations.map((donation) => (
                <div
                  key={donation._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-lg">
                          {donation.bloodType}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(donation.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {donation.location}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Droplet className="h-4 w-4 mr-1" />
                          {donation.quantity}ml
                        </span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                          {donation.status}
                        </span>
                      </div>
                      {donation.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          "{donation.notes}"
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => downloadCertificate(donation)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg"
                        title="Download Certificate"
                      >
                        <Download className="h-4 w-4" />
                        <span className="font-medium">Certificate</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DonationHistory;
