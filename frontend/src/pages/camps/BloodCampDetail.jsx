import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import QRCode from "react-qr-code";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building2,
  Phone,
  Mail,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  Download,
  QrCode,
} from "lucide-react";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const BloodCampDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userType } = useSelector((state) => state.auth);
  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetchCampDetails();
  }, [id]);

  const fetchCampDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/camps/${id}`);
      if (response.data.success) {
        setCamp(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching camp details:", error);
      toast.error("Failed to load camp details");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      toast.error("Please login to register for this camp");
      navigate("/login/user");
      return;
    }

    if (userType !== "user") {
      toast.error("Only donors can register for blood camps");
      return;
    }

    setRegistering(true);
    try {
      const response = await axios.post(`/camps/${id}/register`);
      if (response.data.success) {
        toast.success("Successfully registered for the blood camp!");
        fetchCampDetails(); // Refresh to show updated registration count
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    setRegistering(true);
    try {
      const response = await axios.post(`/camps/${id}/unregister`);
      if (response.data.success) {
        toast.success("Successfully unregistered from the blood camp");
        fetchCampDetails(); // Refresh to show updated registration count
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unregistration failed");
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ongoing":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isUserRegistered = () => {
    if (!user || !camp) return false;
    return camp.registeredDonors?.some((donor) => donor.donor._id === user._id);
  };

  const isCampFull = () => {
    if (!camp) return false;
    return camp.registeredDonors?.length >= camp.expectedDonors;
  };

  const canRegister = () => {
    if (!camp) return false;
    return (
      camp.status === "upcoming" &&
      !isUserRegistered() &&
      !isCampFull() &&
      userType === "user"
    );
  };

  const generateQRData = () => {
    if (!user || !camp) return null;

    const qrData = {
      type: "camp-registration",
      campId: camp._id,
      userId: user._id,
      userName: user.name,
      bloodType: user.bloodType,
      campTitle: camp.title,
      timestamp: new Date().toISOString(),
    };

    return JSON.stringify(qrData);
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `camp-qr-${camp.title.replace(/\s+/g, "-")}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!camp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-12">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Camp Not Found
          </h2>
          <p className="text-gray-700 mb-6">
            This blood camp doesn't exist or has been removed.
          </p>
          <Link
            to="/camps"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Camps
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/camps"
          className="inline-flex items-center text-gray-700 hover:text-red-600 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Camps
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase border mb-4 ${getStatusColor(
                      camp.status
                    )}`}
                  >
                    {camp.status}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {camp.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span className="font-medium">
                      Organized by {camp.organizerDetails?.name}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="capitalize">
                      {camp.organizerDetails?.type}
                    </span>
                  </div>
                </div>

                {isUserRegistered() && (
                  <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-bold text-green-900">Registered</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">
                {camp.description}
              </p>
            </Card>

            {/* Date & Time */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Date & Time
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Date</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatDate(camp.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Time</p>
                    <p className="text-lg font-bold text-gray-900">
                      {camp.startTime} - {camp.endTime}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Location */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {camp.venue}
                    </p>
                    <p className="text-gray-700 mt-1">{camp.address}</p>
                    <p className="text-gray-600 mt-1">{camp.city}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Facilities */}
            {camp.facilities && camp.facilities.length > 0 && (
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Facilities Available
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {camp.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900">
                        {facility}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Requirements */}
            {camp.requirements && (
              <Card className="bg-blue-50 border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Special Requirements
                </h2>
                <p className="text-gray-700">{camp.requirements}</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card className="sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Registration
              </h3>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 font-medium">
                    Registered Donors
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {camp.registeredDonors?.length || 0} / {camp.expectedDonors}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      isCampFull() ? "bg-red-600" : "bg-green-600"
                    }`}
                    style={{
                      width: `${Math.min(
                        ((camp.registeredDonors?.length || 0) /
                          camp.expectedDonors) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                {isCampFull() && (
                  <p className="text-xs text-red-600 font-medium mt-2">
                    Camp is full
                  </p>
                )}
              </div>

              {camp.status === "upcoming" && user && userType === "user" ? (
                <button
                  onClick={
                    isUserRegistered() ? handleUnregister : handleRegister
                  }
                  disabled={
                    registering || (isCampFull() && !isUserRegistered())
                  }
                  className={`w-full py-3 rounded-lg font-bold transition-colors disabled:cursor-not-allowed ${
                    isUserRegistered()
                      ? "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
                      : "bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
                  }`}
                >
                  {registering
                    ? isUserRegistered()
                      ? "Unregistering..."
                      : "Registering..."
                    : isUserRegistered()
                    ? "✓ Registered - Click to Unregister"
                    : isCampFull()
                    ? "Camp is Full"
                    : "Register for This Camp"}
                </button>
              ) : camp.status === "upcoming" && !user ? (
                <Link
                  to="/login/user"
                  className="block text-center w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  Login to Register
                </Link>
              ) : isCampFull() ? (
                <div className="text-center py-3 bg-gray-100 border-2 border-gray-300 text-gray-600 rounded-lg font-bold">
                  Camp is Full
                </div>
              ) : camp.status !== "upcoming" ? (
                <div className="text-center py-3 bg-gray-100 border-2 border-gray-300 text-gray-600 rounded-lg font-bold capitalize">
                  Camp is {camp.status}
                </div>
              ) : null}

              {!isUserRegistered() && camp.status === "upcoming" && (
                <p className="text-xs text-gray-600 text-center mt-3">
                  By registering, you commit to attend this blood donation camp
                </p>
              )}

              {/* QR Code Section - Show only if user is registered */}
              {isUserRegistered() && camp.status === "upcoming" && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 py-3 rounded-lg font-bold hover:bg-blue-100 transition-colors"
                  >
                    <QrCode className="h-5 w-5" />
                    <span>{showQR ? "Hide" : "Show"} QR Code</span>
                  </button>

                  {showQR && (
                    <div className="mt-4 p-4 bg-white border-2 border-blue-200 rounded-lg">
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg inline-block">
                          <QRCode
                            id="qr-code-svg"
                            value={generateQRData()}
                            size={200}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                        <p className="text-sm text-gray-700 font-medium mt-3 mb-2">
                          Your Registration QR Code
                        </p>
                        <p className="text-xs text-gray-600 mb-4">
                          Show this at the camp entrance for quick check-in
                        </p>
                        <button
                          onClick={downloadQRCode}
                          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors mx-auto"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download QR</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Contact Information */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Contact Person
                    </p>
                    <p className="font-bold text-gray-900">
                      {camp.contactPerson?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Phone</p>
                    <a
                      href={`tel:${camp.contactPerson?.phone}`}
                      className="font-bold text-red-600 hover:text-red-700"
                    >
                      {camp.contactPerson?.phone}
                    </a>
                  </div>
                </div>
                {camp.contactPerson?.email && (
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Email</p>
                      <a
                        href={`mailto:${camp.contactPerson?.email}`}
                        className="font-bold text-red-600 hover:text-red-700 break-all"
                      >
                        {camp.contactPerson?.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Blood Bank Partner */}
            {camp.bloodBankPartner && (
              <Card className="bg-purple-50 border-purple-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Blood Bank Partner
                </h3>
                <p className="font-bold text-gray-900">
                  {camp.bloodBankPartner.name}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {camp.bloodBankPartner.address}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {camp.bloodBankPartner.city}
                </p>
                {camp.bloodBankPartner.phone && (
                  <a
                    href={`tel:${camp.bloodBankPartner.phone}`}
                    className="text-sm font-bold text-purple-600 hover:text-purple-700 mt-2 inline-block"
                  >
                    {camp.bloodBankPartner.phone}
                  </a>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodCampDetail;
