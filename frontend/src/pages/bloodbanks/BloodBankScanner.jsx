import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  QrCode,
  CheckCircle,
  XCircle,
  ArrowLeft,
  User,
  Droplet,
  Calendar,
  Phone,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/Card";
import QRScanner from "../../components/QRScanner";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const BloodBankScanner = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showScanner, setShowScanner] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [recentDonations, setRecentDonations] = useState([]);
  const [lastDonor, setLastDonor] = useState(null);
  const [pendingDonor, setPendingDonor] = useState(null);
  const [bloodAmount, setBloodAmount] = useState(450);
  const [confirming, setConfirming] = useState(false);

  const handleScanSuccess = async (qrData) => {
    try {
      setVerifying(true);

      // Validate QR data
      if (qrData.type !== "blood-donation") {
        toast.error("Invalid QR code type");
        setVerifying(false);
        return;
      }

      if (!qrData.userId) {
        toast.error("Invalid QR code - missing user information");
        setVerifying(false);
        return;
      }

      // Fetch user details from backend to check eligibility
      const response = await axios.get(`/auth/users/${qrData.userId}`);

      if (response.data.success) {
        const donor = response.data.data;

        // Check if donor can donate (90-day gap)
        if (donor.lastDonationDate) {
          const lastDonation = new Date(donor.lastDonationDate);
          const daysSince = Math.floor(
            (Date.now() - lastDonation) / (1000 * 60 * 60 * 24)
          );

          if (daysSince < 90) {
            const daysRemaining = 90 - daysSince;
            toast.error(
              `Donor must wait ${daysRemaining} more days before donating again`,
              { duration: 5000 }
            );
            setVerifying(false);
            setShowScanner(false);
            return;
          }
        }

        // Show donor info for confirmation
        setPendingDonor({
          ...donor,
          qrData,
        });
        setBloodAmount(450); // Reset to default
        setShowScanner(false);
        toast.success("Donor information loaded. Please confirm donation.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load donor information"
      );
      setShowScanner(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleConfirmDonation = async () => {
    if (!pendingDonor || !bloodAmount || bloodAmount <= 0) {
      toast.error("Please enter a valid blood amount");
      return;
    }

    try {
      setConfirming(true);

      // Record donation with backend
      const response = await axios.post(`/bloodbanks/verify-donation`, {
        userId: pendingDonor._id,
        quantity: bloodAmount,
      });

      if (response.data.success) {
        toast.success(`✓ ${response.data.data.donor.name} donation recorded!`);
        setLastDonor(response.data.data);

        // Add to recent donations list
        setRecentDonations((prev) => [
          {
            ...response.data.data,
            quantity: bloodAmount,
          },
          ...prev.slice(0, 9),
        ]);

        // Clear pending donor
        setPendingDonor(null);
        setBloodAmount(450);
      }
    } catch (error) {
      console.error("Donation recording error:", error);
      toast.error(error.response?.data?.message || "Failed to record donation");
    } finally {
      setConfirming(false);
    }
  };

  const handleCancelDonation = () => {
    setPendingDonor(null);
    setBloodAmount(450);
    toast("Donation cancelled", { icon: "ℹ️" });
  };

  const handleScannerClose = () => {
    setShowScanner(false);
  };

  return (
    <DashboardLayout activeTab="scanner" userType="bloodbank">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate("/bloodbank/dashboard")}
            className="inline-flex items-center text-gray-700 hover:text-red-600 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Donation Scanner</h1>
          <p className="text-gray-600 mt-1">
            Scan donor QR codes to verify identity and record donations
          </p>
        </div>

        {/* Blood Bank Info */}
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {user?.name}
              </h2>
              <p className="text-sm text-gray-600">{user?.city}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {recentDonations.length}
              </div>
              <div className="text-sm text-gray-600">Today's Donations</div>
            </div>
          </div>
        </Card>

        {/* Scanner Button */}
        <Card>
          <div className="text-center py-8">
            <QrCode className="h-20 w-20 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ready to Scan
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Click the button below to open the camera and scan donor QR codes.
              The donation will be automatically recorded and inventory updated.
            </p>
            <button
              onClick={() => setShowScanner(true)}
              disabled={verifying}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <QrCode className="h-6 w-6" />
              <span>{verifying ? "Verifying..." : "Start Scanning"}</span>
            </button>
          </div>
        </Card>

        {/* Last Scanned Donor */}
        {lastDonor && (
          <Card className="bg-green-50 border-green-200">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Last Verified Donor
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-gray-700">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-semibold">
                      {lastDonor.donor.name}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Droplet className="h-4 w-4 mr-2" />
                    <span className="font-semibold">
                      Blood Type: {lastDonor.donor.bloodType}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{lastDonor.donor.phone}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    ✓ Donation recorded • Total Donations:{" "}
                    {lastDonor.donor.totalDonations}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Recent Donations */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Today's Donations ({recentDonations.length})
          </h3>
          {recentDonations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <XCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No donations recorded today</p>
              <p className="text-sm mt-1">
                Start scanning QR codes to record donations
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDonations.map((donation, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {donation.donor.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Blood Type:{" "}
                        <span className="font-semibold text-red-600">
                          {donation.donor.bloodType}
                        </span>
                        {" • "}
                        {donation.quantity || 450}ml
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Recorded</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Confirmation Modal */}
        {pendingDonor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Confirm Donation
                </h2>
                <p className="text-gray-600">
                  Review donor information and specify blood amount
                </p>
              </div>

              {/* Donor Information */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Donor Name</div>
                      <div className="font-bold text-gray-900 text-lg">
                        {pendingDonor.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Droplet className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Blood Type</div>
                      <div className="font-bold text-red-600 text-lg">
                        {pendingDonor.bloodType}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-semibold text-gray-900">
                        {pendingDonor.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Droplet className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">
                        Total Donations
                      </div>
                      <div className="font-semibold text-gray-900">
                        {pendingDonor.totalDonations || 0} donations
                      </div>
                    </div>
                  </div>

                  {pendingDonor.lastDonationDate && (
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-600">
                          Last Donation
                        </div>
                        <div className="font-semibold text-gray-900">
                          {new Date(
                            pendingDonor.lastDonationDate
                          ).toLocaleDateString()}{" "}
                          (
                          {Math.floor(
                            (Date.now() -
                              new Date(pendingDonor.lastDonationDate)) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days ago)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Blood Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blood Amount (ml) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  min="100"
                  max="500"
                  step="50"
                  value={bloodAmount}
                  onChange={(e) =>
                    setBloodAmount(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
                  placeholder="Enter amount in ml"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setBloodAmount(350)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
                  >
                    350ml
                  </button>
                  <button
                    onClick={() => setBloodAmount(450)}
                    className="px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 rounded border border-purple-300 font-semibold"
                  >
                    450ml (Standard)
                  </button>
                  <button
                    onClick={() => setBloodAmount(500)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
                  >
                    500ml
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDonation}
                  disabled={confirming}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDonation}
                  disabled={confirming || !bloodAmount || bloodAmount <= 0}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {confirming ? "Recording..." : "Confirm Donation"}
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Important Note */}
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Important Guidelines:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Donors must wait 90 days (3 months) between donations</li>
                <li>
                  Each donation automatically updates blood bank inventory
                </li>
                <li>Verify donor identity matches QR code information</li>
                <li>Standard donation volume is 450ml</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          isOpen={showScanner}
          onScanSuccess={handleScanSuccess}
          onClose={handleScannerClose}
        />
      )}
    </DashboardLayout>
  );
};

export default BloodBankScanner;
