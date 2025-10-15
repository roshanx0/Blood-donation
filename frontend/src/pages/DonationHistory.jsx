import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import Card from "../components/Card";
import Loader from "../components/Loader";
import AddDonationModal from "../components/AddDonationModal";
import DashboardLayout from "../components/DashboardLayout";
import {
  Calendar,
  MapPin,
  Droplet,
  Award,
  Plus,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

const DonationHistory = () => {
  const { user } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleAddDonation = () => {
    setShowAddModal(false);
    fetchDonations();
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
              Track your blood donation journey
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Donation</span>
          </button>
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
              Start your life-saving journey by recording your first donation
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Add Your First Donation
            </button>
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
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Add Donation Modal */}
      <AddDonationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddDonation}
      />
    </DashboardLayout>
  );
};

export default DonationHistory;
