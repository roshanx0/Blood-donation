import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  QrCode,
  CheckCircle,
  XCircle,
  ArrowLeft,
  User,
  Droplet,
  Calendar,
  MapPin,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import QRScanner from "../../components/QRScanner";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const CampScanner = () => {
  const { id: campId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [scannedDonors, setScannedDonors] = useState([]);
  const [lastScannedDonor, setLastScannedDonor] = useState(null);

  useEffect(() => {
    fetchCampDetails();
  }, [campId]);

  const fetchCampDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/camps/${campId}`);
      if (data.success) {
        setCamp(data.data);
        // Extract already attended donors
        const attended = data.data.registeredDonors.filter((r) => r.attended);
        setScannedDonors(attended);
      }
    } catch (error) {
      console.error("Error fetching camp:", error);
      toast.error("Failed to load camp details");
    } finally {
      setLoading(false);
    }
  };

  const handleScanSuccess = async (qrData) => {
    try {
      setVerifying(true);

      // Validate QR data
      if (qrData.type !== "camp-registration") {
        toast.error("Invalid QR code type");
        return;
      }

      if (qrData.campId !== campId) {
        toast.error("This QR code is for a different camp");
        return;
      }

      // Verify attendance with backend
      const response = await axios.post(`/camps/${campId}/verify-attendance`, {
        userId: qrData.userId,
      });

      if (response.data.success) {
        toast.success(
          `✓ ${response.data.data.donor.name} attendance verified!`
        );
        setLastScannedDonor(response.data.data);

        // Refresh camp details to update the list
        await fetchCampDetails();
      }
    } catch (error) {
      console.error("Verification error:", error);
      if (error.response?.data?.alreadyVerified) {
        toast.error("This donor's attendance was already verified");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to verify attendance"
        );
      }
    } finally {
      setVerifying(false);
      setShowScanner(false);
    }
  };

  const handleScannerClose = () => {
    setShowScanner(false);
  };

  const getAttendanceStats = () => {
    if (!camp) return { attended: 0, registered: 0, percentage: 0 };
    const attended = camp.registeredDonors.filter((r) => r.attended).length;
    const registered = camp.registeredDonors.length;
    const percentage =
      registered > 0 ? Math.round((attended / registered) * 100) : 0;
    return { attended, registered, percentage };
  };

  if (loading) {
    return (
      <DashboardLayout activeTab="my-camps" userType="organization">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  if (!camp) {
    return (
      <DashboardLayout activeTab="my-camps" userType="organization">
        <Card className="text-center p-12">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Camp Not Found
          </h2>
          <button
            onClick={() => navigate("/organization/my-camps")}
            className="mt-4 inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Camps
          </button>
        </Card>
      </DashboardLayout>
    );
  }

  const stats = getAttendanceStats();

  return (
    <DashboardLayout activeTab="my-camps" userType="organization">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate("/organization/my-camps")}
            className="inline-flex items-center text-gray-700 hover:text-red-600 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Camps
          </button>
          <h1 className="text-3xl font-bold text-gray-900">QR Code Scanner</h1>
          <p className="text-gray-600 mt-1">
            Scan donor QR codes to mark attendance and record donations
          </p>
        </div>

        {/* Camp Info Card */}
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {camp.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(camp.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {camp.venue}
                </div>
              </div>
            </div>
            <div
              className={`px-4 py-2 rounded-lg font-bold text-sm ${
                camp.status === "upcoming"
                  ? "bg-blue-100 text-blue-800"
                  : camp.status === "ongoing"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {camp.status.toUpperCase()}
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.registered}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Total Registered
            </div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.attended}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Attended & Verified
            </div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {stats.percentage}%
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Attendance Rate
            </div>
          </Card>
        </div>

        {/* Scanner Button */}
        <Card>
          <div className="text-center py-8">
            <QrCode className="h-20 w-20 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ready to Scan
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Click the button below to open the camera and scan donor QR codes.
              Attendance will be automatically marked and donation records will
              be created.
            </p>
            <button
              onClick={() => setShowScanner(true)}
              disabled={verifying}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <QrCode className="h-6 w-6" />
              <span>{verifying ? "Verifying..." : "Start Scanning"}</span>
            </button>
          </div>
        </Card>

        {/* Last Scanned Donor */}
        {lastScannedDonor && (
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
                      {lastScannedDonor.donor.name}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Droplet className="h-4 w-4 mr-2" />
                    <span className="font-semibold">
                      Blood Type: {lastScannedDonor.donor.bloodType}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    ✓ Attendance marked • Donation record created
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Attended Donors List */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Verified Donors ({stats.attended})
          </h3>
          {stats.attended === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <XCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No donors verified yet</p>
              <p className="text-sm mt-1">
                Start scanning QR codes to mark attendance
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {camp.registeredDonors
                .filter((r) => r.attended)
                .map((registration, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {registration.donor?.name || "Donor"}
                        </div>
                        <div className="text-sm text-gray-600">
                          Blood Type:{" "}
                          <span className="font-semibold text-red-600">
                            {registration.donor?.bloodType}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
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

export default CampScanner;
