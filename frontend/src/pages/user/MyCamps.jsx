import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import DashboardLayout from "../../components/DashboardLayout";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  QrCode,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";

const MyCamps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCamps();
  }, []);

  const fetchMyCamps = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/camps/my-registered-camps");
      setCamps(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching my camps:", err);
      setError(
        err.response?.data?.message || "Failed to load registered camps"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateQRData = (camp) => {
    return JSON.stringify({
      type: "camp-registration",
      campId: camp._id,
      userId: camp.registrationInfo.donor,
      userName: camp.registrationInfo.donorName || "User",
      bloodType: camp.registrationInfo.bloodType || "Unknown",
      timestamp: new Date().toISOString(),
    });
  };

  const downloadQRCode = (camp) => {
    const svg = document.getElementById(`qr-code-${camp._id}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `camp-qr-${camp.title.replace(/\s+/g, "-")}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast.success("QR code downloaded!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleViewQR = (camp) => {
    setSelectedCamp(camp);
    setShowQRModal(true);
  };

  const getCampStatus = (camp) => {
    const campDate = new Date(camp.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (camp.status === "completed")
      return { label: "Completed", color: "gray" };
    if (camp.status === "cancelled")
      return { label: "Cancelled", color: "red" };
    if (campDate < today) return { label: "Expired", color: "gray" };
    if (campDate.toDateString() === today.toDateString())
      return { label: "Today", color: "green" };
    return { label: "Upcoming", color: "blue" };
  };

  if (loading) return <Loader />;

  return (
    <DashboardLayout activeTab="my-camps" userType="user">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            My Registered Camps
          </h1>
          <p className="text-gray-600 mt-2">
            View all blood donation camps you've registered for
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {camps.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Registered Camps
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't registered for any blood donation camps yet.
            </p>
            <button
              onClick={() => navigate("/camps")}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
            >
              Browse Available Camps
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {camps.map((camp) => {
              const status = getCampStatus(camp);
              return (
                <div
                  key={camp._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {camp.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {camp.description}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        status.color === "green"
                          ? "bg-green-100 text-green-800"
                          : status.color === "blue"
                          ? "bg-blue-100 text-blue-800"
                          : status.color === "red"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-red-600 mr-2" />
                      <span>
                        {format(new Date(camp.date), "MMMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Clock className="h-4 w-4 text-red-600 mr-2" />
                      <span>
                        {camp.startTime} - {camp.endTime}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin className="h-4 w-4 text-red-600 mr-2" />
                      <span>
                        {camp.venue}, {camp.city}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Users className="h-4 w-4 text-red-600 mr-2" />
                      <span>
                        {camp.registeredDonors?.length || 0} /{" "}
                        {camp.expectedDonors} registered
                      </span>
                    </div>
                  </div>

                  {camp.registrationInfo?.attended && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Attendance Verified
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate(`/camps/${camp._id}`)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleViewQR(camp)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <QrCode className="h-4 w-4" />
                      Show QR
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* QR Code Modal */}
        {showQRModal && selectedCamp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Your Camp QR Code
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Show this QR code at the camp venue for attendance verification
              </p>

              <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-4 flex justify-center">
                <QRCode
                  id={`qr-code-${selectedCamp._id}`}
                  value={generateQRData(selectedCamp)}
                  size={220}
                  level="H"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800 font-medium">
                  Camp: {selectedCamp.title}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {format(new Date(selectedCamp.date), "MMMM dd, yyyy")} •{" "}
                  {selectedCamp.startTime}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => downloadQRCode(selectedCamp)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Download QR
                </button>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyCamps;
